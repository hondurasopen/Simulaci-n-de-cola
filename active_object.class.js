function activeObject (tagName)
{
    this.Obj = document.createElement (tagName == undefined ? "DIV" : tagName);

    this.Obj.style.display = "none";
    this.Obj.style.position = "absolute";
    this.Obj.style.left = "0px";
    this.Obj.style.top = "0px";

    document.body.appendChild (this.Obj);

    this.Show = function ()
    {
        this.Obj.style.display = "block";
    }

    this.Hide = function ()
    {
        this.Obj.style.display = "none";
    }

    this.setPosition = function (x, y)
    {
        if (y == undefined)
        {
            this.Obj.style.left = parseInt (x[0]);
            this.Obj.style.top = parseInt (x[1]);
        }
        else
        {
            this.Obj.style.left = parseInt (x);
            this.Obj.style.top = parseInt (y);
        }
    }

    this.getPosition = function ()
    {
        return [this.x (), this.y ()];
    }

    this.setSize = function (w, h)
    {
        if (h == undefined)
        {
            this.Obj.style.width = parseInt (w[0]);
            this.Obj.style.height = parseInt (w[1]);
        }
        else
        {
            this.Obj.style.width = parseInt (w);
            this.Obj.style.height = parseInt (h);
        }
    }

    this.getSize = function ()
    {
        return [this.width (), this.height ()];
    }

    this.x = function ()
    {
        return parseInt (this.Obj.style.left);
    }

    this.y = function ()
    {
        return parseInt (this.Obj.style.top);
    }

    this.setx = function (Value)
    {
        this.Obj.style.left = parseInt (Value);
    }

    this.sety = function ()
    {
        this.Obj.style.top = parseInt (Value);
    }

    this.width = function ()
    {
        return parseInt (this.Obj.style.width);
    }

    this.height = function ()
    {
        return parseInt (this.Obj.style.height);
    }
    
    this.setWidth = function (Value)
    {
        this.Obj.style.width = parseInt (Value);
    }

    this.setHeight = function (Value)
    {
        this.Obj.style.height = parseInt (Value);
    }
}
