/* Clase de Clientes. */
function Cliente (Num, Transaccion)
{
    this.Transaccion = Transaccion;
    this.tiempoRequerido = this.Transaccion.tiempoRequerido ();
    this.Num = Num;
    this.State = "";
    this.tiempoEstado = new Tiempo (0, 0);

    this.toString = function ()
    {
        return "CLIENTE#" + this.Num + "(" + this.State + ") ";
    };
    
    this.setState = function (NombreEstado, tiempoEstado)
    {
        this.tiempoEstado = tiempoEstado;
        this.State = NombreEstado;
    };

    this.id = function ()
    {
        return "C" + this.Num;
    };
}