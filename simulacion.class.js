/* Clase de Simulacion de Banco. */
function Simulacion ()
{
    /* Capacidad de cada elemento. */
    this.cAsientos = 50;
    this.cFila = [15, 17, 13, 15, 13];
    this.cCajera = [1, 1, 1, 1, 1];

    /* Intervalo de simulacion. */
    this.Interval = 150;

    /* Contenido de cada elemento. */
    this.dAsientos = [];

    /* Numero de clientes siendo atendidos. */
    this.Atendiendo = 0;

    /* Hora de inicio y de fin de la simulacion. */
    this.horaInicio = new Tiempo (6, 0);
    this.horaFin = new Tiempo (22, 0);

    /* Hora actual de la simulacion. */
    this.horaActual = new Tiempo (0, 0);

    /* Frecuencia de Llegada de Clientes. */
    this.frecLlegada = new Rango (1, 1);

    /* Tipos de Transacciones. */
    this.Transacciones = [];

    /* Distribucion de transacciones. */
    this.distTransacciones = [];

    /* Rango de distribucion de transacciones. */
    this.distRango = null;

    /* Hora en la cual llegara un cliente. */
    this.siguienteCliente = 0;

    /* Indica si se utilizaran sprites o no. */
    this.withSprites = 0;

    /* Estadisticas de simulacion. */
    this.Stats = 
    { 
        Abandonaron: 0,
        Entraron: 0,
        Sentaron: 0,
        Servidos: 0,
        Transacciones: 0,

        Enfilados: 0,
        TiempoEnfilados: 0
    };

    /* Tamaño de Caja de Sprite. */
    this.boxSize = 16;

    /**/
    this.Control = function ()
    {
        var i, j, k, m, p;

        /* Control del banco. */
        if (this.horaActual.getLinear () == this.horaFin.getLinear ())
            return;

        this.g.Update ();

        /* Decrementa el tiempo de llegada de cliente. */
        this.siguienteCliente--;

        /* ---------- INTERACCION: CLIENTE-BANCO ---------- */

        /* Verifica si ya es hora de que un cliente llegue. */
        if (this.siguienteCliente < 1)
        {
            this.siguienteCliente = this.frecLlegada.getValor ();

            /* Ha llegado un cliente. */
            this.g.EntrarBanco ();
            this.Stats.Entraron++;

            /* Buscar la fila que tenga menos personas. */
            for (i = j = 0; i < this.dFila.length; i++)
            {
                if (this.dFila[i].length < this.dFila[j].length)
                {
                    j = i;
                }
            }

            /* Si todas las filas estan llenas, sentarse. */
            if (this.dFila[j].length == this.cFila[j])
            {
                /* Si no hay asiento, salir del banco. */
                if (this.dAsientos.length == this.cAsientos)
                {
                    /* No caben mas personas, cliente debe abandonar. */
                    this.Stats.Abandonaron++;
                    this.g.DejarBanco ();
                }
                else
                {
                    p = new Cliente (this.Stats.Entraron, this.Transacciones [this.distTransacciones [this.distRango.getValor ()]]);
                    this.g.aceptarCliente (p.id ());

                    p.setState ("SENTADO", this.horaActual.Clone ());
                    this.Stats.Sentaron++;
                    this.dAsientos.push (p);
                    this.g.clienteSentado (p.id (), this.dAsientos.length - 1);
                }
            }
            else
            {
                p = new Cliente (this.Stats.Entraron, this.Transacciones [this.distTransacciones [this.distRango.getValor ()]]);
                this.g.aceptarCliente (p.id ());

                /* Entrar a la fila con menos personas. */
                p.setState ("HACIENDO FILA", this.horaActual.Clone ());
                this.Stats.Enfilados++;

                this.dFila[j].push (p);
                this.g.clienteEnFila (p.id (), j, this.dFila[j].length - 1);
            }
        }

        /* ---------- INTERACCION: CAJERA-CLIENTE ---------- */

        for (k = 0; k < this.dCajera.length; k++)
        {
            /* Si la cajera esta libre, atender a un cliente. */
            if (this.dCajera[k].length != this.cCajera[k])
            {
                m = [];

                /* Obtener filas no vacias. */
                for (i = 0; i < this.dFila.length; i++)
                {
                    if (this.dFila[i].length != 0) m.push (i);
                }

                if (m.length)
                    j = m [(new Rango (0, m.length - 1)).getValor ()];
                else
                    j = -1;

                /* Atender al cliente de la fila, si lo hay. */
                if (j != - 1 && this.dFila[j].length)
                {
                    p = this.dFila[j].shift ();

                    for (m = 0; m < this.dFila[j].length; m++)
                    {
                        this.g.clienteEnFila (this.dFila[j][m].id (), j, m);
                    }

                    this.dCajera[k].push (p);

                    this.g.atendiendoCliente (p.id (), k);

                    this.Stats.TiempoEnfilados += this.horaActual.getLinear () - p.tiempoEstado.getLinear ();

                    p.setState ("SIENDO ATENDIDO", this.horaActual.Clone ());
                    this.Atendiendo++;

                    this.sTrans [p.Transaccion.Indice].Total++;
                    this.sTrans [p.Transaccion.Indice].Tiempo += p.tiempoRequerido;

                    this.Stats.Transacciones++;

                    this.sCajera[k].addLinear (p.tiempoRequerido);
                }
                else
                {
                    this.tCajera[k]++;
                }
            }
            else
            {
                this.sCajera[k].subLinear (1);

                if (!this.sCajera[k].getLinear ())
                {
                    p = this.dCajera[k].shift ();

                    p.setState ("SERVIDO", this.horaActual.Clone ());
                    this.Stats.Servidos++;

                    this.g.clienteSaliendo (p.id ());
                    this.Atendiendo--;
                }
            }
        }

        /* ---------- INTERACCION: ASIENTOS-FILA ---------- */
        while (this.dAsientos.length != 0)
        {
            /* Buscar la fila que tenga menos personas. */
            for (i = j = 0; i < this.dFila.length; i++)
            {
                if (this.dFila[i].length < this.dFila[j].length)
                {
                    j = i;
                }
            }

            if (this.dFila[j].length == this.cFila[j]) break;

            /* Si hay alguna fila no llena, se movera un cliente a esta. */
            p = this.dAsientos.shift ();

            p.setState ("HACIENDO FILA", this.horaActual.Clone ());
            this.Stats.Enfilados++;

            this.dFila[j].push (p);

            if (this.g)
            {
                this.g.clienteEnFila (p.id (), j, this.dFila[j].length - 1);

                for (m = 0; m < this.dAsientos.length; m++)
                {
                    this.g.clienteSentado (this.dAsientos[m].id (), m);
                }
            }
        }

        /***/

        this.horaActual.addLinear (1);

        var r = this; window.setTimeout (function () { r.Control () }, this.Interval);
    }

    /* Inicia la simulacion. */
    this.Iniciar = function ()
    {
        var i, j, k, p;

        this.dCajera = [];
        this.dFila = [];
        this.sCajera = [];
        this.tCajera = [];

        this.sTrans = [];

        for (i = 0; i < this.cFila.length; i++)
            this.dFila.push ([]);

        for (i = 0; i < this.cCajera.length; i++)
        {
            this.dCajera.push ([]);
            this.sCajera.push (new Tiempo (0, 0));
            this.tCajera.push (0);
        }
        
        for (i = 0; i < this.Transacciones.length; i++)
        {
            this.sTrans[i] = { Tiempo: 0, Total: 0 };
        }

        this.g = new graphicalSimulation (this);

        this.horaActual = this.horaInicio.Clone ();

        /* Distribuir las transacciones. */
        for (i = 0; i < this.Transacciones.length; i++)
        {
            k = parseInt (this.Transacciones[i].Distribucion * 100);
            while (k-- != 0) this.distTransacciones.push (i);
        }

        /* Calcular rango de distribuciones. */
        this.distRango = new Rango (0, this.distTransacciones.length - 1);

        /* Calcula la hora de llegada del primer cliente. */
        this.siguienteCliente = this.frecLlegada.getValor ();

        var r = this; window.setTimeout (function () { r.Control () }, this.Interval);
    };
    
    this.numCajeras = function (Num)
    {
        var i;

            this.cCajera = [];

            for (i = 0; i < Num; i++) this.cCajera.push (1);
    };
    
    this.numFilas = function (Num, Cap)
    {
        var i;

            this.cFila = [];

            for (i = 0; i < Num; i++) this.cFila.push (Cap);
    }

    this.numAsientos = function (Num)
    {
            this.cAsientos = Num;
    }

}