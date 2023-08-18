fetch("https://us-central1-septima-esquina.cloudfunctions.net/app/api/menues")
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        if (data.status == 200) {
            const menuesList = data.menuesList;   

            const menuContainer = document.getElementById("menuContainer");
            
            if (menuesList != null) {
                for (const menu of menuesList) {
                    const menuDiv = document.createElement("div");
                    menuDiv.className = "col-md-12";
                    menuDiv.innerHTML = `
                  <div class="menu-title">
                    ${menu.name}
                  </div>
                `;
                    menuContainer.appendChild(menuDiv);
            
                    // Create image container
                    const imageContainer = document.createElement("div");
                    imageContainer.className = "col-md-4 col-sm-12";
                    imageContainer.innerHTML = `
                    <div class="image-container">  
                        <img src="${menu.imageSrc}" class="menu-image" alt="Imagen No Encontrada" onerror="this.src='https://firebasestorage.googleapis.com/v0/b/septima-esquina.appspot.com/o/logo.jpg?alt=media&token=0aa183ec-8413-4087-b23b-a6f5ea7a401a';"/>
                    </div>
                `;
                    menuContainer.appendChild(imageContainer);
            
                    // Create menu items container
                    const menuItemsContainer = document.createElement("div");
                    menuItemsContainer.className = "col-md-8 col-sm-12 menu";
            
                    for (const item of menu.products) {
                        const menuItem = document.createElement("div");
                        menuItem.className = "row";
                        menuItem.innerHTML = `
                    <div class="menu-item">
                        <div class="menu-name">${item.name}</div>
                        <div class="menu-price">$${item.price}</div>
                    </div>
                  `;
            
                        const descriptionRow = document.createElement("div");
                        descriptionRow.className = "row";
                        descriptionRow.innerHTML = `
                    <div class="menu-description">${item.description}</div>
                  `;
            
                        menuItemsContainer.appendChild(menuItem);
                        menuItemsContainer.appendChild(descriptionRow);
                    }
            
                    menuContainer.appendChild(menuItemsContainer);
                }
            }
        }
    })
    .catch((error) => {
        console.log(error) 
    }); 