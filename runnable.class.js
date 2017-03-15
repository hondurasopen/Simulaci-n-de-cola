/* Runnable Class */
function Runnable ()
{
    this.className = "Runnable";
    this.Interval = 600;

    this.Prologue = function () {}
    this.Main = function () {}
    this.Epilogue = function () {}
    this.Cycle = 0;

    this.Start = function ()
    {
        var p = this;

            this.Cycle = 0;
            this.Prologue ();

            this.intervalHandle = window.setInterval (function () { p.RunCycle (); }, this.Interval);
    }

    this.RunCycle = function ()
    {
            this.Main();
            this.Cycle++;
    }

    this.Stop = function ()
    {
        window.clearInterval (this.intervalHandle);
        this.Epilogue ();
    }
}
