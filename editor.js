/**
 * TOLOSA VISUAL EDITOR (VCM)
 * Una herramienta sencilla para editar contenido directamente en la web.
 */

(function() {
    // 1. Crear la UI del Editor
    const editorUI = document.createElement('div');
    editorUI.id = 'tolosa-editor-panel';
    editorUI.innerHTML = `
        <div class="editor-controls">
            <div class="editor-header">
                <img src="https://huggingface.co/spaces/xizaie/tolosa-handball-thunder/resolve/main/images/escudo%20tolosa.png" class="h-6 mr-2">
                <span>Modo Editor</span>
            </div>
            <div class="editor-body">
                <p>Haz clic en cualquier texto o imagen para editar.</p>
                <div class="flex flex-col space-y-2 mt-4">
                    <button id="save-draft" class="editor-btn primary">Guardar Borrador</button>
                    <button id="export-code" class="editor-btn secondary">Exportar Cambios</button>
                    <button id="reset-editor" class="editor-btn danger">Limpiar Todo</button>
                </div>
            </div>
        </div>
        <button id="toggle-editor" class="editor-toggle">
            <span class="edit-icon">✎</span>
            <span class="close-icon">✕</span>
        </button>
    `;
    document.body.appendChild(editorUI);

    // 2. Estilos para el editor (se podrían mover a CSS)
    const styles = document.createElement('style');
    styles.textContent = `
        #tolosa-editor-panel {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            z-index: 9999;
            font-family: 'Roboto', sans-serif;
        }
        .editor-toggle {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: #3B82F6;
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            font-size: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
        }
        .editor-toggle:hover { transform: scale(1.1); }
        .edit-icon { display: block; }
        .close-icon { display: none; }
        .active .edit-icon { display: none; }
        .active .close-icon { display: block; }
        .active .editor-toggle { background: #EF4444; }

        .editor-controls {
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 250px;
            background: white;
            border-radius: 1rem;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            display: none;
            overflow: hidden;
            border: 1px solid #e2e8f0;
        }
        .active .editor-controls { display: block; }

        .editor-header {
            background: #0E1A3D;
            color: white;
            padding: 1rem;
            font-weight: 900;
            text-transform: uppercase;
            font-size: 0.8rem;
            display: flex;
            align-items: center;
        }
        .editor-body { padding: 1rem; font-size: 0.9rem; color: #475569; }
        
        .editor-btn {
            width: 100%;
            padding: 0.6rem;
            border-radius: 0.5rem;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 0.7rem;
            cursor: pointer;
            border: none;
            transition: opacity 0.2s;
        }
        .editor-btn:hover { opacity: 0.9; }
        .editor-btn.primary { background: #3B82F6; color: white; }
        .editor-btn.secondary { background: #0E1A3D; color: white; }
        .editor-btn.danger { background: #fee2e2; color: #ef4444; }

        [contenteditable="true"] {
            outline: 2px dashed #3B82F6;
            outline-offset: 4px;
            background: rgba(59, 130, 246, 0.05);
            border-radius: 4px;
        }
        .editable-image {
            cursor: pointer;
            position: relative;
        }
        .editable-image:hover::after {
            content: 'Cambiar Imagen';
            position: absolute;
            inset: 0;
            background: rgba(59, 130, 246, 0.4);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            backdrop-filter: blur(2px);
        }
        
        /* Dark mode compatibility for panel */
        .dark .editor-controls { background: #1a202c; border-color: #2d3748; }
        .dark .editor-body { color: #e2e8f0; }
    `;
    document.head.appendChild(styles);

    // 3. Lógica de Activación e Inicio
    let isEditMode = false;
    const toggleBtn = document.getElementById('toggle-editor');
    
    // Cargar cambios previos de localStorage al iniciar
    window.addEventListener('DOMContentLoaded', () => {
        loadFromLocalStorage();
        feather.replace(); // Asegurar que los iconos se carguen
    });

    toggleBtn.addEventListener('click', () => {
        isEditMode = !isEditMode;
        editorUI.classList.toggle('active');
        document.body.classList.toggle('editor-active');
        enableEditing(isEditMode);
    });

    function enableEditing(enable) {
        // Habilitar textos
        document.querySelectorAll('[data-edit="text"]').forEach((el, index) => {
            el.contentEditable = enable;
            if (enable) {
                el.addEventListener('input', () => saveToLocalStorage(el, index, 'text'));
            }
        });

        // Habilitar imágenes
        document.querySelectorAll('[data-edit="image"]').forEach((el, index) => {
            if (enable) {
                el.classList.add('editable-image');
                el.onclick = () => updateImage(el, index);
            } else {
                el.classList.remove('editable-image');
                el.onclick = null;
            }
        });
    }

    function updateImage(el, index) {
        const newUrl = prompt('Introduce la nueva URL de la imagen:', el.src);
        if (newUrl) {
            el.src = newUrl;
            saveToLocalStorage(el, index, 'image');
        }
    }

    // 4. Persistencia en LocalStorage
    function saveToLocalStorage(el, index, type) {
        const pageKey = window.location.pathname;
        let pageData = JSON.parse(localStorage.getItem('tolosa_edits') || '{}');
        if (!pageData[pageKey]) pageData[pageKey] = {};
        
        pageData[pageKey][index] = {
            type: type,
            content: type === 'text' ? el.innerHTML : el.src
        };
        
        localStorage.setItem('tolosa_edits', JSON.stringify(pageData));
    }

    function loadFromLocalStorage() {
        const pageKey = window.location.pathname;
        const pageData = JSON.parse(localStorage.getItem('tolosa_edits') || '{}');
        const edits = pageData[pageKey];
        
        if (edits) {
            Object.keys(edits).forEach(index => {
                const edit = edits[index];
                const elements = edit.type === 'text' ? 
                    document.querySelectorAll('[data-edit="text"]') : 
                    document.querySelectorAll('[data-edit="image"]');
                
                if (elements[index]) {
                    if (edit.type === 'text') {
                        elements[index].innerHTML = edit.content;
                    } else {
                        elements[index].src = edit.content;
                    }
                }
            });
        }
    }

    // 5. Guardado y Exportación
    document.getElementById('save-draft').addEventListener('click', () => {
        alert('¡Cambios guardados en el navegador! Se mantendrán aunque cambies de página o cierres la pestaña.');
    });

    document.getElementById('export-code').addEventListener('click', () => {
        const clone = document.documentElement.cloneNode(true);
        clone.querySelectorAll('#tolosa-editor-panel, style, script[src="editor.js"]').forEach(el => el.remove());
        clone.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));
        clone.querySelectorAll('.editable-image').forEach(el => el.classList.remove('editable-image'));
        
        const htmlContent = '<!DOCTYPE html>\n' + clone.outerHTML;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const fileName = window.location.pathname.split('/').pop() || 'index.html';
        a.download = fileName;
        a.click();
        
        alert('Se ha descargado ' + fileName + ' con tus cambios. Reemplaza el archivo original para que sean permanentes.');
    });

    document.getElementById('reset-editor').addEventListener('click', () => {
        if (confirm('¿Quieres borrar TODOS los cambios guardados en esta página y volver al diseño original?')) {
            const pageKey = window.location.pathname;
            let pageData = JSON.parse(localStorage.getItem('tolosa_edits') || '{}');
            delete pageData[pageKey];
            localStorage.setItem('tolosa_edits', JSON.stringify(pageData));
            window.location.reload();
        }
    });

})();
