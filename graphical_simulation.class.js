function graphicalSimulation (Simulation)
{
    document.body.innerHTML = "";

    this.sim = Simulation;

    this.MaxTime = 110;
    this.Interval = 10;

    /* Objetos Activos */
    this.Fila = [];
    this.Cajera = [];
    this.Asientos = [];
 
    this.Entrada = null;
    this.Salida = null;

    this.Tiempo = null;
    this.Estado = null;

    this.Cliente = [];
    this.Base = null;
    
    this.dCliente = [];

    /* Dibuja el entorno. */
    this.drawLayout = function ()
    {
        var i, mi = 0, k, f, c, Y = 96;

            this.Base = c = new activeObject ();

            c.setSize (this.sim.boxSize, this.sim.boxSize);

            /* Dibujar Filas */
            for (i = 0; i < this.sim.cFila.length; i++)
            {
                this.Fila.push ([]);

                for (j = 0; j < this.sim.cFila[i]; j++)
                {
                    this.Fila [i].push (f = new activeObject ());

                    k = 64 + (c.width () + 8) * j;
                    if (k > mi) mi = k;

                    f.Obj.style.background = "#008FCF"
                    f.Obj.style.border = "1px solid #00FFFF";

                    f.setSize (c.width () + 4, c.height () + 4);
                    f.setPosition (k, Y + (c.height () + 8) * i);

                    f.Show ();
                }
            }

            k = Y + (c.height () + 8) * (this.sim.cFila.length - this.sim.cCajera.length) / 2;

            /* Dibujar Cajeras */
            for (i = 0; i < this.sim.cCajera.length; i++)
            {
                this.Cajera.push (f = new activeObject ());

                f.Obj.style.background = "#8F00CF"
                f.Obj.style.border = "1px solid #FF00FF";

                if (this.sim.withSprites)
                    f.Obj.innerHTML = "<img src='cajera.png' width='"+(this.sim.boxSize+4)+"' height='"+(this.sim.boxSize+4)+"'>";

                f.setSize ((c.width () + 4), (c.height () + 4));
                f.setPosition (16, k + (c.height () + 8) * i);

                f.Show ();
            }

            /* Dibujar Asientos */
            i = mi + c.width () + 16;
            j = Y;

            for (k = 0; k < this.sim.cAsientos; k++)
            {
                if (!(k & 15) && k)
                {
                    j = Y;
                    i += c.width () + 8;
                }

                f = new activeObject ();

                f.Obj.style.background = "#8FCF00"
                f.Obj.style.border = "1px solid #FFFF00";

                f.setSize ((c.width () + 4), (c.height () + 4));
                f.setPosition (i, j);

                j += c.height () + 8;

                f.Show ();

                this.Asientos.push (f);
            }

            /* Dibujar Puerta de Entrada. */
            this.Entrada = f = new activeObject ();

            f.Obj.style.background = "#CF8F00"
            f.Obj.style.border = "1px solid #FFFF00";

            f.setSize (c.width () + 8, c.height () + 8);
            f.setPosition (i + 128, Y + 5 * (c.height () + 8));

            f.Show ();

            /* Dibujar Puerta de Salida. */
            this.Salida = f = new activeObject ();

            f.Obj.style.background = "#CF8F00"
            f.Obj.style.border = "1px solid #FFFF00";

            f.setSize (c.width () + 8, c.height () + 8);
            f.setPosition (i + 128, Y + 9 * (c.height () + 8));

            f.Show ();

            /* Dibuja el indicador del tiempo. */
            this.Tiempo = new activeObject ();

            this.Tiempo.Obj.style.background = "#F0F0F0"
            this.Tiempo.Obj.style.padding = "8px"
            this.Tiempo.Obj.style.border = "1px solid #C0C0C0";
            this.Tiempo.Obj.style.color = "#707070";
            this.Tiempo.Obj.style.fontWeight = "bold";
            this.Tiempo.Obj.style.fontSize = "28px";

            this.Tiempo.setPosition (16, 16);

            this.Tiempo.Show ();
            
            /* Dibuja el indicador del estado. */
            this.Estado = new activeObject ("PRE");

            this.Estado.Obj.style.background = "#F0F0F0"
            this.Estado.Obj.style.margin = "0px";
            this.Estado.Obj.style.padding = "8px"
            this.Estado.Obj.style.border = "1px solid #C0C0C0";
            this.Estado.Obj.style.color = "black";
            this.Estado.Obj.style.fontSize = "12px";

            this.Estado.setPosition (64, 280);

            this.Estado.Show ();
    };

    this.Update = function ()
    {
        var str = "", i, t;

            t = this.sim.horaActual.getLinear () - this.sim.horaInicio.getLinear ();
            this.Tiempo.Obj.innerHTML = this.sim.horaActual.toString ();

            str += "Tiempo Predecido de Llegada:         " + this.sim.siguienteCliente + "\n";

            str += "Tiempo de Simulaci&oacute;n:         " + t + " Minutos\n\n";

            str += "Clientes que Entraron:        " + this.sim.Stats.Entraron + "\n";

            if (this.sim.Stats.Entraron != 0)
            {
                str += "Clientes que fueron Servidos: " + this.sim.Stats.Servidos + " (" + formatFloat (this.sim.Stats.Servidos*100/this.sim.Stats.Entraron, 0, 2) + "%)" + "\n";
                str += "Clientes que Abandonaron:     " + this.sim.Stats.Abandonaron + " (" + formatFloat (this.sim.Stats.Abandonaron*100/this.sim.Stats.Entraron, 0, 2) + "%)" + "\n";
                str += "Clientes que se Sentaron:     " + this.sim.Stats.Sentaron + " (" + formatFloat (this.sim.Stats.Sentaron*100/this.sim.Stats.Entraron, 0, 2) + "%)" + "\n";
            }

            str += "\n";

            if (this.sim.Stats.Enfilados != 0)
            {
                str += "Clientes que hicieron fila:   " + this.sim.Stats.Enfilados + "\n";
                str += "Tiempo promedio en fila:      " + formatFloat (this.sim.Stats.TiempoEnfilados / this.sim.Stats.Enfilados, 0, 2) + " Minutos\n";
            }

            str += "\n";

            for (i = 0; i < this.sim.tCajera.length; i++)
            {
                str += "Tiempo de Ocio de Cajera #" + (i + 1) + ":  " + 
                        formatFloat (this.sim.tCajera[i]*100/t, 0, 2)
                        + "%\n";
            }

            str += "\n";

            for (i = 0; i < this.sim.sTrans.length; i++)
            {
                str += this.sim.Transacciones [i].Nombre + ": " +
                       formatFloat (this.sim.sTrans[i].Total * 100 / this.sim.Stats.Transacciones, 0, 2) + "%\n";
            }

            this.Estado.Obj.innerHTML = str;
    };

    this.EntrarBanco = function ()
    {
        var p, Cliente = new activeObject ();

            this.Cliente.push (Cliente);

            if (this.sim.withSprites)
                Cliente.Obj.innerHTML = "<img src='cliente.png' width='"+(this.sim.boxSize)+"' height='"+(this.sim.boxSize)+"'>";

            Cliente.Obj.style.background = rgbFromArray ([parseInt (Math.random () * 250), parseInt (Math.random () * 250), parseInt (Math.random () * 250)]);
            Cliente.setPosition (sumArrays ([4, 4], this.Entrada.getPosition ()));
            Cliente.setSize (this.Base.getSize ());

            Cliente.Show ();

            p = new LinearInterpolator ();
            p.MaxTime = 2 * this.MaxTime; p.Interval = this.Interval;

            p.Source = [Cliente.x ()];
            p.Target = [Cliente.x () - 96];

            p.Related = Cliente;

            p.Initialize ();
            
            p.Prologue = function () { this.Related.Avail = false; };
            p.Epilogue = function () { this.Related.Avail = true; };

            p.Action = function ()
            {
                this.Related.setx (this.Result[0]);
            };

            p.Start ();
    };

    this.DejarBanco = function ()
    {
        var Cliente, p, q;

            Cliente = this.Cliente.pop ();

            p = new LinearInterpolator ();
            p.MaxTime = 2 * this.MaxTime; p.Interval = this.Interval;

            p.Related = Cliente;

            p.Target = sumArrays ([3,3], this.Salida.getPosition ());

            p.Prologue = function () { this.Related.Avail = false; };
            p.Epilogue = function () { document.body.removeChild (this.Related.Obj); };

            p.Action = function ()
            {
                this.Related.setPosition (this.Result);
            };

            (q = new Runnable ()).Interval = 5; q.Main = function ()
            {
                if (p.Related.Avail) 
                {
                    p.Source = Cliente.getPosition ();
                    p.Initialize ();

                    p.Start (); 
                    this.Stop (); 
                }                    
            };

            q.Start ();
    };

    this.aceptarCliente = function (cId)
    {
        this.dCliente [cId] = this.Cliente.pop ();
    };

    this.clienteSentado = function (cId, Asiento)
    {
        var Cliente = this.dCliente [cId], p, q;

            p = new LinearInterpolator ();
            p.MaxTime = this.MaxTime; p.Interval = this.Interval;

            p.Related = Cliente;

            p.Target = sumArrays ([3,3], this.Asientos [Asiento].getPosition ());

            p.Prologue = function () { this.Related.Avail = false; };
            p.Epilogue = function () { this.Related.Avail = true; };

            p.Action = function ()
            {
                this.Related.setPosition (this.Result);
            };

            (q = new Runnable ()).Interval = 5; q.Main = function ()
            {
                if (p.Related.Avail) 
                {
                    p.Source = Cliente.getPosition ();
                    p.Initialize ();

                    p.Start (); 
                    this.Stop (); 
                }                    
            };

            q.Start ();
    };

    this.clienteEnFila = function (cId, Fila, Posicion)
    {
        var Cliente = this.dCliente [cId], p, q;

            p = new LinearInterpolator ();
            p.MaxTime = this.MaxTime; p.Interval = this.Interval;

            p.Related = Cliente;

            p.Target = sumArrays ([3,3], this.Fila [Fila][Posicion].getPosition ());

            p.Prologue = function () { this.Related.Avail = false; };
            p.Epilogue = function () { this.Related.Avail = true; };

            p.Action = function ()
            {
                this.Related.setPosition (this.Result);
            };

            (q = new Runnable ()).Interval = 5; q.Main = function ()
            {
                if (p.Related.Avail) 
                {
                    p.Source = Cliente.getPosition ();
                    p.Initialize ();

                    p.Start (); 
                    this.Stop (); 
                }                    
            };

            q.Start ();
    };

    this.atendiendoCliente = function (cId, Cajera)
    {
        var Cliente = this.dCliente [cId], p, q;

            p = new LinearInterpolator ();
            p.MaxTime = this.MaxTime; p.Interval = this.Interval;

            p.Related = Cliente;

            p.Target = sumArrays ([3,3], this.Cajera [Cajera].getPosition ());

            p.Prologue = function () { this.Related.Avail = false; };
            p.Epilogue = function () { this.Related.Avail = true; };

            p.Action = function ()
            {
                this.Related.setPosition (this.Result);
            };

            (q = new Runnable ()).Interval = 5; q.Main = function ()
            {
                if (p.Related.Avail) 
                {
                    p.Source = Cliente.getPosition ();
                    p.Initialize ();

                    p.Start (); 
                    this.Stop (); 
                }
            };

            q.Start ();
    };

    this.clienteSaliendo = function (cId)
    {
        var Cliente = this.dCliente [cId], p, q;

            p = new LinearInterpolator ();
            p.MaxTime = 8 * this.MaxTime; p.Interval = this.Interval;

            p.Related = Cliente;

            p.Target = sumArrays ([3,3], this.Salida.getPosition ());

            p.Prologue = function () { this.Related.Avail = false; };
            p.Epilogue = function () { document.body.removeChild (this.Related.Obj); };

            p.Action = function ()
            {
                this.Related.setPosition (this.Result);
            };

            (q = new Runnable ()).Interval = 5; q.Main = function ()
            {
                if (p.Related.Avail) 
                {
                    p.Source = Cliente.getPosition ();
                    p.Initialize ();

                    p.Start (); 
                    this.Stop (); 
                }
            };

            q.Start ();
    };

    this.drawLayout ();
};