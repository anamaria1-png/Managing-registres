window.addEventListener("load", () => {
    fetch("testData.txt", {
        method: "GET",
        mode: 'cors',
        headers: { "Content-Type": "text/plain" },
    })
        .then(response => response.text())
        .then(data => {

            //Initialize select options

            let rows = data.split('\r\n');
            let selectOptions = [new Set(), new Set(), new Set()];
            let table = [];

            rows.forEach(row => {
                table.push([]);
                let columns = row.split(',');
                columns.forEach(column => {
                    let index = column[0].charCodeAt() - 'A'.charCodeAt();
                    selectOptions[index].add(column);
                    table[table.length - 1].push(column);
                });
            })

            selectOptions.forEach(options => {
                options.forEach(value => {
                    createSelectOptionElement(`#column-${value[0].toLowerCase()}`, value, value, ["toate", "toate", "toate"]);
                })
            })

            // Initialize table container

            let tableContainer = document.querySelector('#table');
            table.forEach(row => {
                let p = document.createElement('p');
                p.innerText = row.join(', ');
                tableContainer.appendChild(p);
            });

            // Initialize select options copy

            let selectOptionsCpy = [new Set(), new Set(), new Set()];
            selectOptions.forEach((options, index) => {
                options.forEach(option => {
                    selectOptionsCpy[index].add(option);
                });
            });


            // Add select logic

            let selectA = document.querySelector('#column-a');
            let selectB = document.querySelector('#column-b');
            let selectC = document.querySelector('#column-c');

            selectA.addEventListener('change', () => {
                console.log("*", selectA.value, selectB.value, selectC.value);
                selectOptionsCpy.splice(1, 2, new Set(), new Set());
                table.forEach(row => {
                    if(row[0] === selectA.value || selectA.value === "toate"){
                        selectOptionsCpy[1].add(row[1]);
                        selectOptionsCpy[2].add(row[2]);
                    }
                });
                if(selectB.value !== 'toate' && !selectOptionsCpy[1].has(selectB.value)){
                    console.log("I was here, ", selectOptionsCpy);
                    selectB.value = selectOptionsCpy[1].size > 1 ? "toate" : selectOptionsCpy[1].values().next().value;
                }
                if(selectC.value !== 'toate' && !selectOptionsCpy[2].has(selectC.value)){
                    selectC.value = selectOptionsCpy[2].size > 1 ? "toate" : selectOptionsCpy[2].values().next().value;
                }
                let rows = updateDisplayedTable(table, selectA.value, selectB.value, selectC.value);
                if(rows.length === 1){
                    selectB.value = rows[0][1];
                    selectC.value = rows[0][2];
                }
                updateSelectOptions(selectOptionsCpy, [selectA.value, selectB.value, selectC.value]);
            });

            selectB.addEventListener("change", () => {
                selectOptionsCpy.splice(2, 1, new Set());
                table.forEach(row => {
                    if((row[0] === selectA.value || selectA.value === "toate") && (row[1] == selectB.value || selectB.value === "toate")){
                        selectOptionsCpy[2].add(row[2]);
                    }
                });
                let rows = updateDisplayedTable(table, selectA.value, selectB.value, selectC.value);
                if(rows.length === 1){
                    selectA.value = rows[0][0];
                    selectC.value = rows[0][2];
                }
                updateSelectOptions(selectOptionsCpy, [selectA.value, selectB.value, selectC.value]);
            });

            selectC.addEventListener("change", () => {
                let rows = updateDisplayedTable(table, selectA.value, selectB.value, selectC.value);
                if(rows.length === 1){
                    selectA.value = rows[0][0];
                    selectB.value = rows[0][1];
                }
                updateSelectOptions(selectOptionsCpy, [selectA.value, selectB.value, selectC.value]);
            })

        });
})

function updateDisplayedTable(table, a, b, c){
    let tableContainer = document.querySelector('#table');
    while(tableContainer.firstChild){
        tableContainer.removeChild(tableContainer.lastChild);
    }

    console.log(a, b, c);
    let rows = []

    table.forEach(row => {
        if((a === "toate" || a === row[0]) && (b === "toate" || b === row[1]) && (c === "toate" || c === row[2])){
            let p = document.createElement('p');
            p.innerText = row.join(', ');
            tableContainer.appendChild(p);
            rows.push(row);
        }
    })

    return rows;
}

function updateSelectOptions(selectOptions, opts){
    console.log("SelectoOptions", selectOptions);

    console.log("opts: ", opts);

    let columnA = document.querySelector('#column-a');
    while(columnA.firstChild){
        columnA.removeChild(columnA.lastChild);
    }
    let columnB = document.querySelector('#column-b');
    while(columnB.firstChild){
        columnB.removeChild(columnB.lastChild);
    }
    let columnC = document.querySelector('#column-c');
    while(columnC.firstChild){
        columnC.removeChild(columnC.lastChild);
    }

    selectOptions.forEach((options, index) => {
        if(options.size > 1){
            createSelectOptionElement(`#column-${intToChar(index)}`, "toate", "Toate", opts[index]);
        } else {
            opts[index] = options.values().next().value;
            console.log(options, opts);
        }
        options.forEach(value => {
            createSelectOptionElement(`#column-${value[0].toLowerCase()}`, value, value, opts[index]);
        })
    })
}

function createSelectOptionElement(selector, value, text, opt){
    let select = document.querySelector(selector);
    let option = document.createElement("option");
    option.value = value;
    option.text = text;
    if(value === opt){
        option.selected = true;
    }
    select.appendChild(option);
}

function intToChar(int){
    const code = 'a'.charCodeAt();
    return String.fromCharCode(code + int);
}