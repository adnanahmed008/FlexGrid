"use strict";
class TABLE {
    constructor(options) {
        this.ID_TABLE = "";
        this.ID_BODY = "";
        this.ID_PAGER = "";
        this.columns = [];
        this.pageNumber = 1;
        this.pageSize = 10;
        this.totalCount = 0;
        this.lastPageNumber = 1;
        this.sortBy = null;
        this.sortDirection = null;
        this.rows = [];
        this.isMultiSelection = false;
        this.isFirstTwoBtnsDisabled = false;
        this.isLastTwoBtnsDisabled = false;
        this.version = "1.0.0";
        console.log("Table Init");
        this.ID_TABLE = options.tableId;
        this.ID_PAGER = options.pagerId;
        this.ID_BODY = this.ID_TABLE + "_body";
        this.columns = options.columns;
        this.isMultiSelection = options.multiSelect;
        this.sortBy = options.sortBy;
        this.sortDirection = options.sortDirection;
        this.dataCallback = options.dataCallback;
        this.onTableReady = options.onTableReady;
        this.onRowsUpdated = options.onRowsUpdated;
        this.onRowSelect = options.onRowSelect;
        if (options.pageSize && options.pageSize > 0)
            this.pageSize = options.pageSize;
        this.initialize();
    }
    initialize() {
        this.createTable()
            .then(() => { return this.createHeaderRow(); })
            .then(() => { return this.createBody(); })
            .then(() => { return this.createpager(); })
            .then(() => {
            this.onTableReady && this.onTableReady();
            this.getData();
        });
    }
    createTable() {
        console.log("Create Table");
        return new Promise(resolve => {
            this.elTable = document.getElementById(this.ID_TABLE);
            resolve();
        });
    }
    createHeaderRow() {
        console.log("Create Table Header");
        return new Promise(resolve => {
            let thead = document.createElement("thead");
            let row = document.createElement("tr");
            for (var i = 0; i < this.columns.length; i++) {
                const column = this.columns[i];
                column.canSort =
                    column.type == EColType.CHECKBOX || !column.title.length ? false :
                        column.canSort == undefined ? true : column.canSort;
                let cell = document.createElement("th");
                cell.id = "COL_" + column.key;
                cell.innerHTML = column.title;
                cell.classList.add("col-x" + i);
                if (column.className)
                    cell.classList.add(column.className);
                for (let prop in column.styles) {
                    cell.style[prop] = column.styles[prop];
                }
                let sortIcon = document.createElement("div");
                sortIcon.className = "sort-icon";
                cell.appendChild(sortIcon);
                if (column.canSort)
                    cell.onclick = () => {
                        this.onHeaderCellClick(column);
                    };
                row.append(cell);
            }
            thead.append(row);
            this.elTable.append(thead);
            resolve();
        });
    }
    createBody() {
        console.log("Create Table Body");
        return new Promise(resolve => {
            let tbody = document.createElement("tbody");
            tbody.id = this.ID_BODY;
            this.elTable.append(tbody);
            resolve();
        });
    }
    createpager() {
        console.log("Create Table Pager");
        return new Promise(resolve => {
            if (this.ID_PAGER == "") {
                resolve();
                return;
            }
            let elemPager = document.getElementById(this.ID_PAGER);
            elemPager.classList.add("wrapper-current-page");
            // First Page Button
            let btnFirst = document.createElement("button");
            btnFirst.id = `${this.ID_PAGER}_BTN_FIRST`;
            btnFirst.classList.add("actionIcon");
            btnFirst.classList.add("bx-web-ico-first-1-0");
            btnFirst.onclick = () => { this.onFirst(); };
            // Previous Page Button
            let btnPrevious = document.createElement("button");
            btnPrevious.id = `${this.ID_PAGER}_BTN_PREVIOUS`;
            btnPrevious.classList.add("actionIcon");
            btnPrevious.classList.add("bx-web-ico-back-1-0");
            btnPrevious.onclick = () => { this.onPrevious(); };
            // Current Page Details
            let elWrapper = document.createElement("div");
            elWrapper.style.display = "flex";
            elWrapper.style.alignItems = "center";
            elWrapper.style.margin = "0 .5rem";
            let divOne = document.createElement("div");
            divOne.innerText = "";
            let elemInputPageNumber = document.createElement("input"); //as HTMLInputElement;
            elemInputPageNumber.id = "GRID_CURRENT_PAGE_NUMBER";
            elemInputPageNumber.classList.add("textInput");
            elemInputPageNumber.classList.add("pager-Input");
            elemInputPageNumber.type = "text";
            elemInputPageNumber.onchange = (e) => { this.onPageNumberInputChange(e); };
            elemInputPageNumber.onkeyup = (e) => { this.onPageNumberInputKeyup(e); };
            let elLastPageNumber = document.createElement("div");
            elLastPageNumber.id = "LAST_PAGE_NUMBER";
            elLastPageNumber.innerText = "/ " + this.lastPageNumber;
            elWrapper.append(divOne);
            elWrapper.append(elemInputPageNumber);
            elWrapper.append(elLastPageNumber);
            // Next Page Button
            let btnNext = document.createElement("button");
            btnNext.id = `${this.ID_PAGER}_BTN_NEXT`;
            btnNext.classList.add("actionIcon");
            btnNext.classList.add("bx-web-ico-next-1-0");
            btnNext.onclick = () => { this.onNext(); };
            // Last Page Button
            let btnLast = document.createElement("button");
            btnLast.id = `${this.ID_PAGER}_BTN_LAST`;
            btnLast.classList.add("actionIcon");
            btnLast.classList.add("bx-web-ico-last-1-0");
            btnLast.onclick = () => { this.onLast(); };
            let selectPageSize = document.createElement("select");
            selectPageSize.id = `${this.ID_PAGER}_PAGE_SIZE`;
            selectPageSize.classList.add("textDropdown");
            let optOne = document.createElement("option");
            let optTwo = document.createElement("option");
            let optThree = document.createElement("option");
            optOne.selected = true;
            optOne.value = optOne.innerText = "10";
            optTwo.value = optTwo.innerText = "20";
            optThree.value = optThree.innerText = "50";
            selectPageSize.append(optOne);
            selectPageSize.append(optTwo);
            selectPageSize.append(optThree);
            selectPageSize.onchange = (e) => {
                this.onPageSizeChange(e.target.value);
            };
            elemPager.append(btnFirst);
            elemPager.append(btnPrevious);
            elemPager.append(elWrapper);
            elemPager.append(btnNext);
            elemPager.append(btnLast);
            elemPager.append(selectPageSize);
            resolve();
        });
    }
    updatePageNumberElem() {
        let el = document.getElementById("GRID_CURRENT_PAGE_NUMBER");
        el.value = this.pageNumber.toString();
    }
    onFirst() {
        this.pageNumber = 1;
        this.getData();
    }
    onPrevious() {
        if (this.pageNumber == 1)
            return;
        if (this.pageNumber > 1)
            this.pageNumber--;
        this.getData();
    }
    onNext() {
        if (this.pageNumber < this.lastPageNumber)
            this.pageNumber++;
        this.getData();
    }
    onLast() {
        this.pageNumber = this.lastPageNumber;
        this.getData();
    }
    onPageSizeChange(size) {
        // console.log("On Change: ", size);
        this.pageSize = parseInt(size);
        this.pageNumber = 1;
        this.getData();
    }
    onPageNumberInputChange(e) {
        let pageNumber = e.target.value;
        this.pageNumber = pageNumber && parseInt(pageNumber) < this.lastPageNumber ? parseInt(pageNumber) : this.pageNumber;
        this.getData();
    }
    onPageNumberInputKeyup(e) {
        // Enter key/button on keyboard
        if (e.keyCode == 13) {
            let pageNumber = e.target.value;
            this.pageNumber = pageNumber && parseInt(pageNumber) < this.lastPageNumber ? parseInt(pageNumber) : this.pageNumber;
            this.getData();
        }
    }
    updateBtnsDisabledStatus() {
        this.isFirstTwoBtnsDisabled = !!(this.pageNumber == 1);
        this.isLastTwoBtnsDisabled = !!(this.pageNumber == this.lastPageNumber);
        var btnFirst = document.getElementById(`${this.ID_PAGER}_BTN_FIRST`);
        var btnPrev = document.getElementById(`${this.ID_PAGER}_BTN_PREVIOUS`);
        var btnNext = document.getElementById(`${this.ID_PAGER}_BTN_NEXT`);
        var btnLast = document.getElementById(`${this.ID_PAGER}_BTN_LAST`);
        if (btnFirst && btnPrev) {
            btnFirst.disabled = this.isFirstTwoBtnsDisabled;
            btnPrev.disabled = this.isFirstTwoBtnsDisabled;
        }
        if (btnNext && btnLast) {
            btnNext.disabled = this.isLastTwoBtnsDisabled;
            btnLast.disabled = this.isLastTwoBtnsDisabled;
        }
    }
    onSelectionChanged(e) {
        const target = e.target;
        const isChecked = target.checked;
        // Unselect others if not multi selection enabled
        if (!this.isMultiSelection) {
            let lstChk = [];
            let body = document.getElementById(this.ID_BODY);
            for (var i = 0; i < body.children.length; i++) {
                const row = body.children[i];
                let chk = row.children[0].children[0];
                // If the found checkbox is not this one
                if (chk.id != target.id)
                    lstChk.push(chk);
            }
            for (let chk of lstChk) {
                chk.checked = false;
            }
        }
        let row = this.rows[parseInt(target.id.split("_")[2])];
        this.onRowSelect && this.onRowSelect(row, isChecked, target);
    }
    getData() {
        console.log("Table Update Results");
        this.dataCallback(this.pageNumber, this.pageSize, this.sortBy, this.sortDirection)
            .then((resp) => {
            if (!resp.hasError) {
                this.totalCount = resp.total;
                this.rows = resp.rows;
                this.updateLastPageIndex();
                this.updatePageNumberElem();
                this.updateBtnsDisabledStatus();
                this.setData();
            }
        });
    }
    setData() {
        let tbody = document.getElementById(this.ID_BODY);
        tbody.innerHTML = "";
        // For each row
        for (var i = 0; i < this.rows.length; i++) {
            this.rows[i].id = "ROW_" + i;
            var row = deepCopy(this.rows[i]);
            // If first column is checkbox
            if (this.columns[0].type == EColType.CHECKBOX)
                row.cells.unshift({ value: EColType.CHECKBOX });
            // Create element for each row
            let elemRow = document.createElement("tr");
            elemRow.classList.add("flex-grid-row");
            if (row.id)
                elemRow.id = row.id;
            if (row.className)
                elemRow.classList.add(row.className);
            // For each cell in row.cells
            for (let k = 0; k < this.columns.length; k++) {
                const column = this.columns[k];
                const cell = row.cells[k];
                // Create element for each cell
                let elemCell = document.createElement("td");
                // If first value is checkbox then create checkbox
                if (cell.value == EColType.CHECKBOX) {
                    let checkbox = document.createElement("input");
                    checkbox.id = "CHK_" + row.id;
                    checkbox.type = "checkbox";
                    checkbox.checked = !!column.checked;
                    if (column.formatterCheckbox)
                        checkbox = column.formatterCheckbox(this.rows[i], checkbox);
                    checkbox.onchange = (e) => {
                        this.onSelectionChanged(e);
                    };
                    elemCell.append(checkbox);
                }
                else {
                    elemCell.className = cell.className || "";
                    elemCell.innerHTML = column.formatter ? column.formatter(this.rows[i]) : cell.value;
                }
                elemRow.append(elemCell);
            }
            tbody.append(elemRow);
            this.onRowsUpdated && this.onRowsUpdated();
        }
    }
    updateLastPageIndex() {
        this.lastPageNumber = Math.ceil(this.totalCount / this.pageSize);
        let el = document.getElementById("LAST_PAGE_NUMBER");
        el.innerText = "of " + this.lastPageNumber.toString();
    }
    onHeaderCellClick(column) {
        let table = document.getElementById(this.ID_TABLE);
        let sortedColumn = table.getElementsByClassName("sortBy")[0];
        if (sortedColumn) {
            sortedColumn.classList.remove("sortBy");
            sortedColumn.classList.remove(this.sortDirection);
        }
        this.sortDirection = column.key != this.sortBy ? ESortDirection.ASCENDING : this.sortDirection == ESortDirection.ASCENDING ? ESortDirection.DECENDING : ESortDirection.ASCENDING;
        this.sortBy = column.key;
        this.pageNumber = 1;
        let th = document.getElementById("COL_" + column.key);
        th.classList.add("sortBy");
        th.classList.add(this.sortDirection);
        this.getData();
    }
    findRowByCheckboxId(id) {
        return this.rows[parseInt(id.split("_")[2])];
    }
    getSelectedRow() {
        let lstChk = [];
        let rows = [];
        let body = document.getElementById(this.ID_BODY);
        for (var i = 0; i < body.children.length; i++) {
            const row = body.children[i];
            let chk = row.children[0].children[0];
            lstChk.push(chk);
        }
        lstChk.forEach(chk => {
            rows.push(this.findRowByCheckboxId(chk.id));
        });
        return rows.length ? this.isMultiSelection ? rows : rows[0] : null;
    }
    getVersion() {
        return this.version;
    }
    refreshData() {
        this.getData();
    }
}
var ESortDirection;
(function (ESortDirection) {
    ESortDirection["ASCENDING"] = "asc";
    ESortDirection["DECENDING"] = "desc";
})(ESortDirection || (ESortDirection = {}));
var EColType;
(function (EColType) {
    EColType["CHECKBOX"] = "checkbox";
})(EColType || (EColType = {}));
const deepCopy = (inObject) => {
    let outObject, value, key;
    if (typeof inObject !== "object" || inObject === null) {
        return inObject; // Return the value if inObject is not an object
    }
    // Create an array or object to hold the values
    outObject = Array.isArray(inObject) ? [] : {};
    for (key in inObject) {
        value = inObject[key];
        // Recursively (deep) copy for nested objects, including arrays
        outObject[key] = deepCopy(value);
    }
    return outObject;
};
