/* Clase de Transaccion. */
function Transaccion(Nombre, Distribucion, RangoTiempo, Indice)
{
    this.Nombre = Nombre;
    this.Distribucion = Distribucion;
    this.RangoTiempo = RangoTiempo;
    this.Indice = Indice;

    this.tiempoRequerido = function ()
    {
        return this.RangoTiempo.getValor ();
    }
};