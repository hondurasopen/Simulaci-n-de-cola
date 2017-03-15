/*
    GRID.CLASS.JS
    
    JavaScript Dynamic Grid Class Version 0.01
    
    Copyright (C) 2009 RedStar Technologies
*/

/****/
function getElem (elemId)
{
    if (document.all)
        return document.all[elemId];
    else
        return document.getElementById (elemId);
}

/****/
function removeChilds (Object)
{
    var obj, next_obj;

        for (obj = Object.firstChild; obj != null; obj = next_obj)
        {
            next_obj = obj.nextSibling;
            Object.removeChild (obj);
        }
}

/****/
function Grid (columnCount, allowAddNew, allowDelete, allowUpdate)
{
    this.allowUpdate = allowUpdate;
    this.allowDelete = allowDelete;
    this.allowAddNew = allowAddNew;
    this.columnCount = columnCount;
    this.colWidths = null;
    this.colStyles = null;
    this.rowHeight = null;
    this.fixedCols = null;
    this.textMatrix = new Array ();
    this.cellMatrix = new Array ();

    this.getObject = function ()
    {
        this.Table = document.createElement ("table");
        var reference = this;

            this.Table.setAttribute ("border", "0");

            this.Table.setAttribute ("cellspacing", "2");
            this.Table.setAttribute ("cellpadding", "4");

            this.THead = document.createElement ("thead");
            this.Table.appendChild (this.THead);

            this.TBody = document.createElement ("tbody");
            this.Table.appendChild (this.TBody);

            this.Textbox = document.createElement ("input");
            this.Textbox.type = "text";

            this.Textbox.style.visibility = "hidden";
            this.Textbox.style.border = "none";
            this.Textbox.style.background = "#f0f0f0";
            this.Textbox.style.width = "100%";

            return this.Table;
    }

    this.setCell = function (j, i, value)
    {
        this.cellMatrix [j][i].innerHTML = value == "" ? "&nbsp;" : value;
        this.textMatrix [j][i] = value;
    }
    
    this.getCell = function (j, i)
    {
        if (this.textMatrix [j][i] == "&nbsp;")
            return "";

        return this.textMatrix [j][i];
    }
    
    this.enableAddRow = function ()
    {
        var tr = document.createElement ("tr"), td = document.createElement ("td");
        var reference = this;

            tr.appendChild (td);
            td.innerHTML = "+";

            td.onclick = function () { reference.addRow (null); }

            this.TBody.appendChild (tr);
    }

    this.setHeader = function (stringArray)
    {
        var tr = document.createElement ("tr");
        var td, reference = this;

            removeChilds (this.THead);
            this.THead.appendChild (tr);

            if (this.allowAddNew || this.allowDelete)
            {
                td = document.createElement ("td");
                tr.appendChild (td);

                td.innerHTML = "<img src='plus.png'>";
                td.style.background = "white";

                if (this.allowAddNew) td.onclick = function () { reference.addRow (null); }
            }

            for (i = 0; i < this.columnCount; i++)
            {
                td = document.createElement ("td");
                td.className = "fixedElement";

                tr.appendChild (td);

                if (this.colWidths) td.style.width = this.colWidths [i];
                if (this.rowHeight) td.style.height = this.rowHeight;

                td.innerHTML = stringArray[i];
            }
    }
    
    this.beginEdit = function (td)
    {
        var reference = this;

            if (this.activeColumn != null)
                this.stopEdit ();

            if (td.innerHTML == "&nbsp;") td.innerHTML = "";

            this.Textbox.value = td.innerHTML;
            td.innerHTML = "";

            td.appendChild (this.Textbox);

            this.Textbox.style.visibility = "visible";

            td.style.background = this.Textbox.style.background;
            td.onkeypress = function (evt) 
            {
                var i, j;

                    if (evt.keyCode == 9)
                    {
                        reference.stopEdit ();

                        j = parseInt (this.parentNode.getAttribute ("celly"));
                        i = parseInt (this.getAttribute ("cellx"));

                        while (1)
                        {
                            if (++i >= reference.columnCount) { i = 0; j++; }

                            if (j < reference.textMatrix.length)
                            {
                                if (reference.fixedCols != null && reference.fixedCols[i])
                                    continue;

                                reference.beginEdit (reference.cellMatrix [j][i]);

                                break;
                            }
                            else
                                return true;
                        }

                        return false;
                    }

                    if (evt.keyCode == 13) 
                    {
                        reference.stopEdit ();
                        return false;
                    }

                    return true;
            }
            
            td.onclick = null;

            this.activeColumn = td;
            this.Textbox.focus ();
    }

    this.stopEdit = function ()
    {
        var reference = this;

            this.activeColumn.onclick = function () { reference.beginEdit (this); };

            if (this.Textbox.value == "")
                this.activeColumn.innerHTML = "&nbsp;";
            else
                this.activeColumn.innerHTML = this.Textbox.value;

            this.textMatrix [this.activeColumn.parentNode.getAttribute ("celly")][this.activeColumn.getAttribute ("cellx")] = this.Textbox.value;

            this.activeColumn.style.background = "white";
            this.activeColumn = null;

            this.Textbox.style.visibility = "hidden";
    }

    this.addRow = function (fieldArray)
    {
        var i, j = this.textMatrix.length, td, reference = this;
        var tr = document.createElement ("tr");

            this.TBody.appendChild (tr);
            tr.setAttribute ("celly", j);

            this.textMatrix [j] = new Array ();
            this.cellMatrix [j] = new Array ();

            if (this.allowAddNew || this.allowDelete)
            {
                td = document.createElement ("td");
                tr.appendChild (td);

                if (this.allowDelete)
                {
                    if (this.rowHeight) td.style.height = this.rowHeight;

                    td.innerHTML = "<img src='minus.png'>";
                    td.onclick = function () 
                    {
                        reference.textMatrix = reference.textMatrix.slice (0,j).concat (reference.textMatrix.slice (j+1));
                        reference.cellMatrix = reference.cellMatrix.slice (0,j).concat (reference.cellMatrix.slice (j+1));

                        reference.TBody.removeChild (tr);

                        var i = j;

                        while (i < reference.cellMatrix.length)
                        {
                            reference.cellMatrix [i][0].parentNode.setAttribute ("celly", i);
                            i++;
                        }
                    }
                }
            }

            for (i = 0; i < this.columnCount; i++)
            {
                td = document.createElement ("td");
                this.cellMatrix [j][i] = td;

                if (this.fixedCols != null && this.fixedCols[i])
                    td.className = "fixedElement";
                else
                    td.className = "normalElement";

                tr.appendChild (td);

                if (fieldArray != null)
                {
                    this.textMatrix [j][i] = fieldArray[i];
                    td.innerHTML = fieldArray[i];
                }
                else
                {
                    this.textMatrix [j][i] = "";
                    td.innerHTML = "&nbsp;"
                }

                if (this.rowHeight) td.style.height = this.rowHeight;
                
                if (this.colStyles && this.colStyles[i] != "")
                {
                    td.setAttribute ("style", this.colStyles[i]);
                }

                td.setAttribute ("cellx", i);

                if (this.allowUpdate)
                {
                    if (this.fixedCols == null || !this.fixedCols[i])
                        td.onclick = function () { reference.beginEdit (this); };
                }
            }
    }
}