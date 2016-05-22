teleprompter
============

Until I graduated college and started programming full time, I worked part time as a teleprompter.

Good teleprompting software is very reactive to an input control -- it should scroll exactly as fast as you need it to, including very slowly and very quickly, and should be able to scroll back just as easily.

As a proof of concept for an in-browser teleprompter, I built this. The speed at which it scrolls
is tied to the y position of the mouse when you start it -- this is the set point.

To scroll very quickly, scroll the mouse down -- it will get exponentially quicker based on how far 
down it is from the set point. To scroll backward, move the mouse above the set point.

To escape the prompter, hit escape.

This project is not at all a substitute for production prompting software -- it's more an experiment
to implement the algorithm behind the mouse scroll control of the prompter scroll speed.

