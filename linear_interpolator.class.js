/* InterpolatorInterpolator Class */
function LinearInterpolator ()
{
    this.MyRunnable = Runnable;
    this.MyRunnable ();

    this.MaxTime = 1000;
    this.Interval = 100;
    
    this.Action = null;
    this.Filter = null;

    this.Source = [];
    this.Target = [];

    this.Factor = null;
    this.Result = null;

    this.Samples = 0;
    this.mCycles = 0;

    this.Main = function () 
    {
        var i, reachedTargets = 0;

            for (i = 0; i < this.Samples; i++)
            {
                this.Result[i] = this.Source[i] + this.Factor[i]*this.Cycle;

                if (this.Factor[i] < 0)
                {
                    this.Result[i] = Math.max (this.Result[i], this.Target[i]);
                }
                else
                {
                    this.Result[i] = Math.min (this.Result[i], this.Target[i]);
                }

                if (this.Result[i] == this.Target[i]) reachedTargets++;

                if (this.Filter) this.Result[i] = this.Filter (this.Result[i]);
            }

            this.Action ();

            if (reachedTargets == this.Samples)
            {
                this.Stop ();
            }
    };

    this.Initialize = function ()
    {
        var i;

            this.Samples = Math.min (this.Source.length, this.Target.length);

            this.mCycles = this.MaxTime / this.Interval;

            this.Factor = [];
            this.Result = [];

            for (i = 0; i < this.Samples; i++)
            {
                this.Factor[i] = (this.Target[i] - this.Source[i] + 1) / this.mCycles;
            }

            this.mCycles = parseInt (this.mCycles) + 1;
    }
}
