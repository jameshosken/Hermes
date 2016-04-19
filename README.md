This is both the client (Arduino*) and server (node.js) code for the NYUAD-NYUSH Rube Goldberg machine.

Originally we had planned to use socket.io, but because of NYU's interesting network restrictions, that option was less possible than we initially hoped. So this backup plan was implemented.

The backup works like this:

Each leg of the machine (i.e. each section with one or more locally connected objects) has a "Begin" point and an "End" point, which are connected to the internet. 

The Begin points constantly send out HTTP requests (to unique URLs for each), and depending on the server's response, either 0 or 1, they WAIT or RUN respectively. Once the Begin point receives it's RUN signal, it ceases sending HTTP requests and runs the code that starts the local chain. (We set up our first Begin point to run once a Big Red Button had been pressed).

The End points simply run as normal (via the Arduino loop), until some sensor detects that the local chain has ended. Upon sensing the end of the local chain, the Arduino fires an HTTP request to a unique URL that then changes the response for the next Begin point from WAIT to RUN.

*The Ardunio example runs on an Ethernet board or with an Ethernet Shield, although some NYUAD implementations that were already connected to processing sketches simple fired the HTTP requests from their processing sketch, and the NYUSH side set up their systems on the YUN.