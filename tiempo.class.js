/* Clase para controlar el tiempo. */
function Tiempo (Horas, Minutos)
{
    this.Horas = Horas;
    this.Minutos = Minutos;

    /* Suma el valor dado al tiempo linear. */
    this.addLinear = function (Valor)
    {
        this.Minutos += Valor;

        while (this.Minutos >= 60)
        {
            this.Horas += 1;
            this.Minutos -= 60;
        }
    }
    
    /* Sustrae el valor dado del tiempo linear. */
    this.subLinear = function (Valor)
    {
        this.Minutos -= Valor;

        while (this.Minutos < 0)
        {
            this.Horas -= 1;
            this.Minutos += 60;
        }
    }

    /* Retorna el valor linear del tiempo. */
    this.getLinear = function ()
    {
        return this.Horas * 60 + this.Minutos;
    }

    /* Cambia el valor linear del tiempo. */
    this.setLinear = function (Valor)
    {
        this.Horas = parseInt (Valor / 60);
        this.Minutos = parseInt (Valor % 60);
    }

    /* Retorna el tiempo como una cadena. */
    this.toString = function ()
    {
        var h = String (this.Horas), m = String (this.Minutos);

        if (h.length < 2) h = "0" + h;
        if (m.length < 2) m = "0" + m;

        return h + ":" + m;
    }
    
    /* Clona el objeto. */
    this.Clone = function ()
    {
        return new Tiempo (this.Horas, this.Minutos);
    }
}