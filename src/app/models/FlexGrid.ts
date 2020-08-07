export class TABLE {
    private ID_TABLE: string = "";
    private ID_BODY: string = "";
    private ID_PAGER: string = "";
    private elTable: HTMLTableElement;
    private columns: IColumn[] = [];
    private pageNumber: number = 1;
    private pageSize: number = 10;
    private totalCount: number = 0;
    private lastPageNumber: number = 1;
    private sortBy: string = null;
    private sortDirection: string = null;
    private rows: IRow[] = [];
    private selectedRows: IRow[] = [];
    private isMultiSelection: boolean = false;
    private isFirstTwoBtnsDisabled: boolean = false;
    private isLastTwoBtnsDisabled: boolean = false;

    private dataCallback: (
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: string
    ) => Promise<{
        rows: IRow[];
        total: number;
        hasError: boolean;
    }>;
    private onTableReady: Function;
    private onRowsUpdated: Function;
    private onRowSelect?: (row: IRow, isSelected: boolean, chk: HTMLInputElement) => void;

    private version: string = "1.0.0";

    constructor(options: {
        tableId: string;
        pagerId: string;
        columns: IColumn[];
        pageSize?: number;
        multiSelect?: boolean;
        sortBy: string;
        sortDirection: string;
        dataCallback: (
            pageNumber: number,
            pageSize: number,
            sortBy: string,
            sortDirection: string
        ) => Promise<{
            rows: IRow[];
            total: number;
            hasError: boolean;
        }>;
        onTableReady?: Function;
        onRowsUpdated?: Function;
        onRowSelect?: (row: IRow, isSelected: boolean, chk: HTMLInputElement) => void;
    }) {
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

        if (options.pageSize && options.pageSize > 0) this.pageSize = options.pageSize;

        this.initialize();
    }

    private initialize() {
        this.createTable()
            .then(() => { return this.createHeaderRow(); })
            .then(() => { return this.createBody(); })
            .then(() => { return this.createPager(); })
            .then(() => {
                this.onTableReady && this.onTableReady();
                this.getData();
            })
    }

    private createTable() {
        console.log("Create Table");
        return new Promise(resolve => {
            this.elTable = document.getElementById(this.ID_TABLE) as HTMLTableElement;
            resolve();
        });
    }

    private createHeaderRow(): Promise<void> {
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
                if (column.className) cell.classList.add(column.className);

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

    private createBody(): Promise<void> {
        console.log("Create Table Body");
        return new Promise(resolve => {
            let tbody = document.createElement("tbody");
            tbody.id = this.ID_BODY;

            this.elTable.append(tbody);

            resolve();
        });
    }

    private createPager() {
        console.log("Create Table Pager");
        return new Promise(resolve => {
            if (this.ID_PAGER == "") { resolve(); return; }



            // #region First Page Button
            let btnFirst = document.createElement("button");
            btnFirst.id = `${this.ID_PAGER}_BTN_FIRST`;
            btnFirst.classList.add("actionIcon");
            btnFirst.classList.add("bx-web-ico-first-1-0");
            btnFirst.onclick = () => { this.onFirst(); };
            // #endregion

            // #region  Previous Page Button
            let btnPrevious = document.createElement("button");
            btnPrevious.id = `${this.ID_PAGER}_BTN_PREVIOUS`;
            btnPrevious.classList.add("actionIcon");
            btnPrevious.classList.add("bx-web-ico-back-1-0");
            btnPrevious.onclick = () => { this.onPrevious(); };
            // #endregion

            // #region Current Page Details
            let elWrapper = document.createElement("div");
            elWrapper.style.display = "flex";
            elWrapper.style.alignItems = "center";
            elWrapper.style.margin = "0 .5rem";
            // #endregion

            // #region Paging Information & Controls

            // Input
            let elemInputPageNumber = document.createElement("input"); //as HTMLInputElement;
            elemInputPageNumber.id = "GRID_CURRENT_PAGE_NUMBER";
            elemInputPageNumber.classList.add("textInput");
            elemInputPageNumber.classList.add("pager-Input");
            elemInputPageNumber.type = "text";
            elemInputPageNumber.onchange = (e: Event) => { this.onPageNumberInputChange(e); };
            elemInputPageNumber.onkeyup = (e: KeyboardEvent) => { this.onPageNumberInputKeyup(e); };

            let elLastPageNumber = document.createElement("div");
            elLastPageNumber.id = "LAST_PAGE_NUMBER";
            elLastPageNumber.innerText = "/ " + this.lastPageNumber;

            elWrapper.append(elemInputPageNumber);
            elWrapper.append(elLastPageNumber);
            // #endregion

            // #region Next Page Button
            let btnNext = document.createElement("button");
            btnNext.id = `${this.ID_PAGER}_BTN_NEXT`;
            btnNext.classList.add("actionIcon");
            btnNext.classList.add("bx-web-ico-next-1-0");
            btnNext.onclick = () => { this.onNext(); };
            // #endregion


            // #region Last Page Button
            let btnLast = document.createElement("button");
            btnLast.id = `${this.ID_PAGER}_BTN_LAST`;
            btnLast.classList.add("actionIcon");
            btnLast.classList.add("bx-web-ico-last-1-0");
            btnLast.onclick = () => { this.onLast(); };
            // #endregion

            // #region Page Size Dropdown
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

            selectPageSize.onchange = (e: Event) => {
                this.onPageSizeChange((e.target as HTMLSelectElement).value);
            }
            // #endregion

            // Pager Controls Wrapper
            let elemPager = document.getElementById(this.ID_PAGER);
            elemPager.classList.add("wrapper-current-page");

            elemPager.append(btnFirst);
            elemPager.append(btnPrevious);
            elemPager.append(elWrapper);
            elemPager.append(btnNext);
            elemPager.append(btnLast);
            elemPager.append(selectPageSize);

            resolve();
        });

    }

    private updatePageNumberElem() {
        let el = document.getElementById("GRID_CURRENT_PAGE_NUMBER") as HTMLInputElement;
        el.value = this.pageNumber.toString();
    }

    private onFirst() {
        this.pageNumber = 1;
        this.getData();
    }

    private onPrevious() {
        if (this.pageNumber == 1) return;
        if (this.pageNumber > 1) this.pageNumber--;

        this.getData();
    }

    private onNext() {
        if (this.pageNumber < this.lastPageNumber) this.pageNumber++;
        this.getData();
    }

    private onLast() {
        this.pageNumber = this.lastPageNumber;
        this.getData();
    }

    private onPageSizeChange(size: string) {
        // console.log("On Change: ", size);
        this.pageSize = parseInt(size);
        this.pageNumber = 1;
        this.getData();
    }

    private onPageNumberInputChange(e: Event) {
        let pageNumber = (e.target as HTMLInputElement).value;
        this.pageNumber = pageNumber && parseInt(pageNumber) < this.lastPageNumber ? parseInt(pageNumber) : this.pageNumber;

        this.getData();
    }

    private onPageNumberInputKeyup(e: KeyboardEvent) {
        // Enter key/button on keyboard
        if (e.keyCode == 13) {
            let pageNumber = (e.target as HTMLInputElement).value;
            this.pageNumber = pageNumber && parseInt(pageNumber) < this.lastPageNumber ? parseInt(pageNumber) : this.pageNumber;

            this.getData();
        }
    }

    private updateBtnsDisabledStatus() {
        this.isFirstTwoBtnsDisabled = !!(this.pageNumber == 1);
        this.isLastTwoBtnsDisabled = !!(this.pageNumber == this.lastPageNumber);

        var btnFirst = document.getElementById(`${this.ID_PAGER}_BTN_FIRST`) as HTMLButtonElement;
        var btnPrev = document.getElementById(`${this.ID_PAGER}_BTN_PREVIOUS`) as HTMLButtonElement;
        var btnNext = document.getElementById(`${this.ID_PAGER}_BTN_NEXT`) as HTMLButtonElement;
        var btnLast = document.getElementById(`${this.ID_PAGER}_BTN_LAST`) as HTMLButtonElement;

        if (btnFirst && btnPrev) {
            btnFirst.disabled = this.isFirstTwoBtnsDisabled;
            btnPrev.disabled = this.isFirstTwoBtnsDisabled;
        }

        if (btnNext && btnLast) {
            btnNext.disabled = this.isLastTwoBtnsDisabled;
            btnLast.disabled = this.isLastTwoBtnsDisabled;
        }
    }

    private onSelectionChanged(e: Event, el?: HTMLInputElement) {
        const elInput = e ? e.target as HTMLInputElement : el;
        const isChecked = elInput.checked;

        // Unselect others if not multi selection enabled
        if (!this.isMultiSelection) {
            // let lstWrpInput = this.elTable.querySelectorAll(".wrp-input");

            // lstWrpInput.forEach((el) => {
            //     el.classList.remove("selected");
            // });

            this.selectedRows = [];
        }

        let row = this.rows[parseInt(elInput.id.split("_")[2])];

        this.onRowSelect && this.onRowSelect(row, isChecked, elInput);

        if (isChecked)
            this.addSelectedRow(row);
        else
            this.removeSelectedRow(row);
    }

    private addSelectedRow(row: IRow) {
        this.selectedRows.push(row);
    }

    private removeSelectedRow(row: IRow) {
        let i = this.selectedRows.findIndex(r => r.id == row.id);
        if (i == -1) return;

        this.selectedRows.splice(i, 1);
    }

    unselectRow(elInput: HTMLInputElement) {
        elInput.checked = false;
        this.onSelectionChanged(null, elInput);
    }

    selectRow(elInput: HTMLInputElement) {
        elInput.checked = true;
        this.onSelectionChanged(null, elInput);
    }

    getSelectedRows() {
        return this.isMultiSelection ? this.selectedRows : this.selectedRows[0];
    }

    private getData() {
        console.log("Table Update Results");
        this.dataCallback(this.pageNumber, this.pageSize, this.sortBy, this.sortDirection)
            .then((resp) => {
                if (!resp.hasError) {
                    this.totalCount = resp.total;
                    this.rows = resp.rows;
                    this.selectedRows = [];
                    this.updateLastPageIndex();
                    this.updatePageNumberElem();
                    this.updateBtnsDisabledStatus();
                    this.setData();
                }
            });
    }

    private setData() {
        let tbody = document.getElementById(this.ID_BODY);
        tbody.innerHTML = "";

        // For each row
        for (var i = 0; i < this.rows.length; i++) {
            this.rows[i].id = "ROW_" + i;
            var row = deepCopy(this.rows[i]);

            // Create Row Element
            let elemRow = document.createElement("tr");
            elemRow.classList.add("flex-grid-row");
            elemRow.setAttribute("data-id", row.cells[0].value);

            if (row.id) elemRow.id = row.id;
            if (row.className) elemRow.classList.add(row.className);

            // If first column is checkbox
            if (this.columns[0].type == EColType.CHECKBOX)
                row.cells.unshift({ value: EColType.CHECKBOX })

            // For each cell in row.cells
            for (let k = 0; k < this.columns.length; k++) {
                const column = this.columns[k];
                const cell = row.cells[k];

                // Create element for each cell
                let elCell = document.createElement("td");

                // If first value is checkbox then create checkbox
                if (cell.value == EColType.CHECKBOX) {

                    let input = document.createElement("input");
                    input.id = "CHK_" + row.id;
                    input.setAttribute("name", input.id);

                    if (this.isMultiSelection) {
                        input.type = "checkbox";
                        input.checked = !!column.checked;
                    }
                    else {
                        input.type = "radio";
                        input.name = "grid";
                    }

                    if (column.formatterCheckbox)
                        input = column.formatterCheckbox(this.rows[i], input);

                    input.onchange = (e: Event) => {
                        this.onSelectionChanged(e);
                    };

                    let label = document.createElement("label");
                    label.setAttribute("for", input.id);
                    label.classList.add("c-select");
                    label.classList.add(this.isMultiSelection ? "checkbox" : "radio");

                    let elCheckboxIndicator = document.createElement("div") as HTMLDivElement;
                    elCheckboxIndicator.classList.add("control-indicator");
                    
                    label.append(input);
                    label.append(elCheckboxIndicator);
                    
                    elCell.append(label);
                }
                else {
                    elCell.className = cell.className || "";
                    elCell.innerHTML = column.formatter ? column.formatter(this.rows[i]) : cell.value;
                }

                elemRow.append(elCell);
            }

            tbody.append(elemRow);
            this.onRowsUpdated && this.onRowsUpdated();
        }
    }

    private updateLastPageIndex() {
        this.lastPageNumber = Math.ceil(this.totalCount / this.pageSize);
        let el = document.getElementById("LAST_PAGE_NUMBER");
        el.innerText = "/ " + this.lastPageNumber.toString();
    }

    private onHeaderCellClick(column: IColumn) {
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

    private findRowByCheckboxId(id: string) {
        return this.rows[parseInt(id.split("_")[2])];
    }

    getVersion() {
        return this.version;
    }

    refreshData() {
        this.getData();
    }
}

export enum ESortDirection {
    ASCENDING = "asc",
    DECENDING = "desc"
}

export enum EColType {
    CHECKBOX = "checkbox"
}
export interface IColumn {
    key: string;
    title: string;
    /**
     * Default: true
     */
    canSort?: boolean;
    className?: string;
    type?: EColType;
    checked?: boolean;
    styles?: IStyle;
    formatter?: (row: IRow) => string;
    formatterCheckbox?: (row: IRow, chk: HTMLInputElement) => HTMLInputElement;
}

export interface IStyle {
    [key: string]: string | number;
}

export interface IRow {
    id: string;
    className?: string;
    cells: ICell[];
}

export interface ICell {
    value: string;
    className?: string;
}

export const deepCopy = <T>(inObject: T): T => {
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
}