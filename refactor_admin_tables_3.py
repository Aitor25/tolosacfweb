import re

with open('js/admin.js', 'r', encoding='utf-8') as f:
    js = f.read()

# 1. loadNewsList
news_regex = r"container\.innerHTML=snap\.docs\.map\(doc=>\{(.*?)\}\)\.join\(''\);"
news_replace = """
    container.innerHTML = '';
    snap.docs.forEach(doc => {
      const d = doc.data();
      const div = document.createElement('div');
      div.style.cssText = "display:flex;justify-content:space-between;align-items:center;padding:1rem;background:rgba(255,255,255,0.03);border-radius:8px;margin-bottom:.5rem;";
      
      const infoDiv = document.createElement('div');
      const titleDiv = document.createElement('div'); titleDiv.style.cssText = "font-weight:700;color:white;margin-bottom:.25rem;"; titleDiv.textContent = d.title;
      const metaDiv = document.createElement('div'); metaDiv.style.cssText = "font-size:.8rem;color:rgba(255,255,255,0.4);display:flex;gap:1rem;";
      
      const dateSpan = document.createElement('span');
      const dVal = d.timestamp ? new Date(d.timestamp.seconds * 1000).toLocaleDateString() : '';
      dateSpan.textContent = dVal;
      
      const tagSpan = document.createElement('span');
      tagSpan.className = "badge badge-blue"; tagSpan.textContent = d.tag || '';
      
      metaDiv.appendChild(dateSpan); metaDiv.appendChild(tagSpan);
      infoDiv.appendChild(titleDiv); infoDiv.appendChild(metaDiv);
      
      const actionDiv = document.createElement('div'); actionDiv.style.cssText = "display:flex;gap:.5rem;";
      const btnEdit = document.createElement('button'); btnEdit.className = "btn btn-ghost btn-sm"; btnEdit.onclick = () => editNews(doc.id);
      const iconEdit = document.createElement('i'); iconEdit.setAttribute('data-feather', 'edit-2'); btnEdit.appendChild(iconEdit);
      const btnDelete = document.createElement('button'); btnDelete.className = "btn btn-danger btn-sm"; btnDelete.onclick = () => deleteNews(doc.id);
      const iconDelete = document.createElement('i'); iconDelete.setAttribute('data-feather', 'trash-2'); btnDelete.appendChild(iconDelete);
      
      actionDiv.appendChild(btnEdit); actionDiv.appendChild(btnDelete);
      div.appendChild(infoDiv); div.appendChild(actionDiv);
      container.appendChild(div);
    });
"""
js = re.sub(news_regex, news_replace, js, flags=re.DOTALL)

with open('js/admin.js', 'w', encoding='utf-8') as f:
    f.write(js)
