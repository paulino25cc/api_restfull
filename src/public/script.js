// TODO: this code has to be modified to support API calls
// to get, update, create and delete elements

let items = [];

fetch("/alunos")
  .then((res) => res.json())
  .then(data => {
    console.log(data);
    items = data;
    renderItems(items);
  })
  .catch(error => console.error('Error:', error));


  async function renderItems(items) {
    const tableBody = document.getElementById("itemsTable").querySelector("tbody");
    tableBody.innerHTML = ""; // Clear existing rows

    items.forEach((item, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.id}</td>
            <td contenteditable="true">${item.nome}</td>
            <td contenteditable="true">${item.curso}</td>
            <td contenteditable="true">${item.ano}</td>
            <td>
                <button onclick="deleteItem(${index})">Delete</button>
            </td>
        `;

        // Add event listeners to each editable cell
        const cells = row.querySelectorAll("td[contenteditable='true']");
        cells.forEach((cell, cellIndex) => {
            cell.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault(); // Prevent line break in cell
                    const property = ["nome", "curso", "ano"][cellIndex];
                    updateItem(index, property, cell.innerText);
                }
            });
        });

        tableBody.appendChild(row);
    });
}



  // atualizar um aluno
  function updateItem(index, property, value) {
    items[index][property] = value;

    fetch(`/alunos/${items[index].id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(items[index]),
    })
    .then((res) => res.json())
    .then(data => {
      console.log(data);
      renderItems(items);
    }).catch(error => console.error('Error:', error));
  }
  
  // remover um aluno
  function deleteItem(index) {
    const id = items[index].id;
    fetch(`/alunos/${id}`, {
      method: "DELETE",
    })
    .then(() => {
      items.splice(index, 1);
      renderItems(items);
    })
    .catch(error => console.error('Error:', error));
  }


  
  
  function createNewItem() {
    const newNome = document.getElementById("nome").value;
    const newCurso = document.getElementById("curso").value;
    const newAno = document.getElementById("ano").value;
  
    if (!newNome || !newCurso || !newAno) {
      alert("Por favor preencha tudo.");
      return;
    }
  
    const newItem = {
      nome: newNome,
      curso: newCurso,
      ano: newAno,
    };

    fetch("/alunos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newItem),
    })
    .then((res) => res.json())
    .then(data => {
      console.log(data);
      items.push(data);
      renderItems(items);
    }).catch(error => console.error('Error:', error));
    
    // clear the input fields
    document.getElementById("nome").value = "";
    document.getElementById("curso").value = "";
    document.getElementById("ano").value = "";

  
  }


  
  