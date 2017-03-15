/****/
function main ()
{
/**************************************************************************************/
    var p = new Grid (3, false, false, true);

        Paragraph ("Center").appendChild (Heading ("1", "Simulación de Banco"));

        document.body.appendChild (document.createElement ("hr"));

        Paragraph ("Center").appendChild (p.getObject ());

        p.fixedCols = Array (1, 0, 1);
        p.colStyles = Array ("", "text-align: right;", "");

        p.colWidths = Array (320, 200, 200);
        p.rowHeight = 32;

        p.setHeader (Array ("Dato", "Valor", "Unidad"));

        p.addRow (Array ("Hora de Inicio de Simulaci&oacute;n (TIEMPO)", "&nbsp;", "Tiempo"));
        p.addRow (Array ("Hora de Fin de Simulaci&oacute;n (TIEMPO)", "&nbsp;", "Tiempo"));
        
        p.addRow (Array ("Número de Cajeras (N&Uacute;MERO)", "&nbsp;", "Cajeros"));
        p.addRow (Array ("Número de Filas (N&Uacute;MERO)", "&nbsp;", "Filas"));
        p.addRow (Array ("Personas por Fila (N&Uacute;MERO)", "&nbsp;", "Personas"));
        p.addRow (Array ("Número de Asientos (N&Uacute;MERO)", "&nbsp;", "Asientos"));
        p.addRow (Array ("Tama&ntilde;o de Sprite (N&Uacute;MERO)", "&nbsp;", "Pixeles"));
        p.addRow (Array ("Frecuencia de Llegada de Clientes (RANGO)", "&nbsp;", "Minutos"));

        p.setCell (0, 1, "08:00");
        p.setCell (1, 1, "12:00");
        p.setCell (2, 1, "3");
        p.setCell (3, 1, "4");
        p.setCell (4, 1, "15");
        p.setCell (5, 1, "15");
        p.setCell (6, 1, "16");
        p.setCell (7, 1, "{1,5}");

/**************************************************************************************/
    var q = new Grid (3, true, true, true);
    var i;

        Paragraph ("Center").appendChild (q.getObject ());

        q.colWidths = Array (200, 200, 200, 200);
        q.rowHeight = 32;

        q.setHeader (Array ("Tipo de Transacción", "Distribución (FLOAT)", "Duración (RANGO)"));

        q.addRow (Array ("Deposito", "0.7", "{5,15}"));
        q.addRow (Array ("Retiro", "0.2", "{4,8}"));
        q.addRow (Array ("Verificar Cheques", "0.1", "{3,4}"));

/**************************************************************************************/
        Paragraph ("Center").appendChild (Button ("  Iniciar Simulación  ", function() { IniciarSimulacion (p, q) }));
}

function rangoValido (txt)
{
    if (txt.charAt (0) != "{" || txt.charAt (txt.length - 1) != "}")
        return false;

    return true;
}

function valoresDeRango (txt)
{
        return txt.substr (1, txt.length - 2).split (","); 
}

function valoresDeTiempo (txt)
{
        return txt.split (":");
}

function tiempoValido (txt)
{
    var i = valoresDeTiempo (txt);
    
        if (i.length != 2) return false;

        if (isNaN (i[1]) || isNaN (i[0]))
            return false;

        if (i[1] < 0 || i[1] > 59 || i[0] < 0)
            return false;

        return true;
}

/**********************************************************************************/

function IniciarSimulacion (p, q)
{
    var i, j, k, r, sim;

    for (i = 0; i < p.textMatrix.length; i++)
    {
        if (p.getCell(i, 1) == "")
        {
            alert ("Parámetro requerido está en blanco.");
            p.beginEdit (p.cellMatrix [i][1]);
            return;
        }

        if (i <= 1)
        {
            if (!tiempoValido (p.getCell (i, 1)))
            {
                alert ("Escriba un TIEMPO válido.");
                p.beginEdit (p.cellMatrix [i][1]);
                return;
            }

            if (i == 1)
            {
                j = valoresDeTiempo (p.getCell (0, 1));
                j = new Tiempo (parseInt(j[0]), parseInt(j[1]));

                k = valoresDeTiempo (p.getCell (1, 1));
                k = new Tiempo (parseInt(k[0]), parseInt(k[1]));

                if (k.getLinear () < j.getLinear ())
                {
                    alert ("Hora de FIN debe ser MAYOR que hora de INICIO.");
                    p.beginEdit (p.cellMatrix [i][1]);
                    return;
                }
            }
        }
        else if (i >= 7)
        {
            if (!rangoValido (p.getCell (i, 1)))
            {
                alert ("Escriba un RANGO válido.");
                p.beginEdit (p.cellMatrix [i][1]);
                return;
            }

            r = valoresDeRango (p.getCell (i, 1));

            if (r.length != 2)
            {
                alert ("Un rango debe contener dos parámetros.");
                p.beginEdit (p.cellMatrix [i][1]);
                return;
            }

            if (isNaN(r[0]) || (r[1]!=undefined && isNaN(r[1])))
            {
                alert ("Los párametros del rango deben ser de tipo NÚMERO.");
                p.beginEdit (p.cellMatrix [i][1]);
                return;
            }
        }
        else
        {
            if (isNaN (p.getCell (i, 1)))
            {
                alert ("Esta celda debe contener un valor de tipo NÚMERO.");
                p.beginEdit (p.cellMatrix [i][1]);
                return;
            }

            if (parseInt (p.getCell (i, 1)) < 1)
            {
                alert ("Esta celda debe contener un valor mayor que cero.");
                p.beginEdit (p.cellMatrix [i][1]);
                return;
            }
        }
    }

    if (!q.textMatrix.length)
    {
        alert ("Por favor ingrese los datos de las transacciones.");
        return;
    }

    for (i = 0; i < q.textMatrix.length; i++)
    {
        for (j = 0; j < 3; j++)
        {
            if (q.getCell(i, j) == "")
            {
                alert ("Parámetro requerido está en blanco.");
                q.beginEdit (q.cellMatrix [i][j]);
                return;
            }
        }

        if (isNaN (q.getCell (i, 1)))
        {
            alert ("Esta celda debe contener un valor de tipo FLOAT.");
            q.beginEdit (q.cellMatrix [i][1]);
            return;
        }

        if (parseFloat (q.getCell (i, 1)) < 0 || parseFloat (q.getCell (i, 1)) > 1)
        {
            alert ("Esta celda debe contener un valor de tasa (entre cero y uno).");
            q.beginEdit (q.cellMatrix [i][1]);
            return;
        }

        if (!rangoValido (q.getCell (i, 2)))
        {
            alert ("Escriba un RANGO válido.");
            q.beginEdit (q.cellMatrix [i][2]);
            return;
        }

        r = valoresDeRango (q.getCell (i, 2));

        if (r.length != 2)
        {
            alert ("Un rango debe contener dos parámetros.");
            q.beginEdit (q.cellMatrix [i][2]);
            return;
        }

        if (isNaN(r[0]) || (r[1] != undefined && isNaN(r[1])))
        {
            alert ("Los párametros del rango deben ser de tipo NÚMERO.");
            q.beginEdit (q.cellMatrix [i][2]);
            return;
        }
    }

    sim = new Simulacion ();

    i = valoresDeTiempo (p.getCell (0, 1));
    sim.horaInicio = new Tiempo (parseInt (i[0], 10), parseInt (i[1], 10));

    i = valoresDeTiempo (p.getCell (1, 1));
    sim.horaFin = new Tiempo (parseInt (i[0], 10), parseInt (i[1], 10));

    sim.numCajeras (parseInt (p.getCell (2, 1)));
    sim.numFilas (parseInt (p.getCell (3, 1)), parseInt (p.getCell (4, 1)));

    sim.numAsientos (parseInt (p.getCell (5, 1)));

    sim.boxSize = parseInt (p.getCell (6, 1));

    i = valoresDeRango (p.getCell (7, 1));
    sim.frecLlegada = new Rango (i[0], i[1]);

    j = [];

    for (i = 0; i < q.textMatrix.length; i++)
    {
        k = valoresDeRango (q.getCell (i, 2));
        j.push (new Transaccion (q.getCell (i, 0), parseFloat (q.getCell (i, 1)), new Rango (k[0], k[1]), i));
    }

    sim.Transacciones = j;

    sim.Iniciar ();
}