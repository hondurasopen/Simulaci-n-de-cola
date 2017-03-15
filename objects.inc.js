/****/
function Paragraph (Align)
{
    var p;

        p = document.createElement ("P");
        p.align = Align;

        document.body.appendChild (p);

        return p;
}

/****/
function Heading (Level, Text)
{
    var p;

        p = document.createElement ("H" + Level);
        p.innerHTML = Text;

        document.body.appendChild (p);
        return p;
}

/****/
function Button (Text, Action)
{
    var p;

        p = document.createElement ("input");

        p.value = Text;
        p.type = "button";
        p.onclick = Action;

        document.body.appendChild (p);
        return p;
}

/****/
function Image (Source, Action)
{
    var p;

        p = document.createElement ("img");

        p.src = Source;
        p.onclick = Action;

        document.body.appendChild (p);
        return p;
}

/****/
function sumArrays (a1, a2)
{
    var i;
    
        for (i = 0; i < a1.length; i++)
            a1[i] += a2[i];

        return a1;
}

/****/
function formatFloat (x, ic, dc)
{
    var i, j = 0, t = String (x).split ("");

        x = "";

        for (i = 0; i < t.length; i++)
        {        
            if (t[i] == ".") 
            {
                i++;
                break;
            }

            x += t[i];
        }

        while (x.length < ic) x = " " + x;

        x += ".";

        for (; i < t.length && j < dc; i++, j++)
        {
            x += t[i++];
        }

        while (j < dc) 
        {
            x += "0";
            j++;
        }

        return x;
}

/* Makes an RGB string usign the given array. */
function rgbFromArray (anArray)
{
    return "rgb(" + anArray[0] + "," + anArray[1] + "," + anArray[2] + ")";
}