/* Clase para controlar rangos. */
function Rango (Min, Max)
{
    /* El valor minimo y maximo del rango. */
    this.Min = parseInt (Min);
    this.Max = parseInt (Max);

    /* Retorna un numero aleatorio entre 0 y 1. */
    this.Random = function ()
    {
        return Math.random ();
    };

    /* Retorna un numero aleatorio entre el rango. */
    this.getValor = function ()
    {
        return parseInt (this.Random () * (this.Max - this.Min + 1) + this.Min);
    };
}