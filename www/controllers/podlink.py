print "Starting Python imports"
from socketIO_client import SocketIO,BaseNamespace
import time as time
import binascii
connected=False
podconnected=False
room='WSP-11213' # this is the pod serial number
#connect string is "channel,interface,protocol"  eg "252,1,2"
#transmit message is 3,channel,data (as hex)
channel="252"
connect=channel+",1,2"  # this is for J1850VPW
s=SocketIO('https://52.36.76.56',5000,verify=False)
#s=SocketIO('50.112.208.127',5000)
datain=""
               
def frompodctrl(args): # channel,intf,proto
        global podconnected
        #print 'podctrl received'
        if not args is None:
             #print args
             if args=="Pod Connected":
                     podconnected=True            
                    
def frompoddata(args): # a transmit type msg 0=type,1=channel,3=can or other in hex
        global datain
        #print 'poddata received'
        if not args is None:
            print args
            datain=datain+args

class Podmsg(BaseNamespace):
    def on_connect(self):
        global connected
        print 'got connect'
        connected=True
    def sendmsg(self,data):
            global channel
            print "sending:",data
            self.emit('topoddata','3,'+channel+','+data)

pod=s.define(Podmsg,'/pod')
pod.on('frompodctrl',frompodctrl)
pod.on('frompoddata',frompoddata)

print 'waiting to connect'
while connected==False:
    s.wait(.1) # need this to wait for data from the room somewhereafter each
    print 'connecting'
print 'sending to server to join room  as client',room
pod.emit('subscribe',room)
while podconnected==False:
        s.wait(1) # wait for Pod Connected
########## NOW WE ARE CONNECTED TO THE NODE SERVER and the pod . So we send it some data.
print " ready to go connecting to VCI"
pod.emit('topodctrl',connect)
s.wait(1) # wait for the response
table1={ '30':'FCFF','31':'FD80','32':'FEB7','33':'FFD3','34':'F81D',
         '35':'F958','36':'FAFE','37':'FBCO','38':'F466','39':'F551'}
pod.sendmsg("24C02F70F69D")
print 'getting VIN14'
s.wait(14) # will get a response print and ignore
datain="" # clear data !
pod.sendmsg("24C022281D00")  # VIN 14
s.wait(2)
# ' grab the 7th and 8th character (ie string segment 6:8)
datain=datain[-12:] # only last 12 chars
print "got Vin14 from ",datain
code1=table1[datain[6:8]]
pod.sendmsg("24C02F70"+code1)
s.wait(15)
print "Turn that key"
datain="" # clear the input
print "getting Vin 15"
time.sleep(10)
pod.sendmsg("24c022281E00") # VIN 15
s.wait(2)
datain=datain[-12:] # only last 12 chars
code2=table1[datain[6:8]] #
pod.sendmsg("24C02F70"+code2)
print "getting Vin16"
s.wait(15)
datain=""
pod.sendmsg("24c022281F00") # VIN 16
s.wait(2)
datain=datain[-12:] # only last 12 chars
code3=table1[datain[6:8]]
pod.sendmsg("24C02F70"+code3)
s.wait(2)
pod.sendmsg("24c022280500")
print "getting pin"
datain=""
s.wait(2)
pin1=datain[-6:-4]
print "Pin1",pin1
pod.sendmsg("24c022280600")
print "getting pin 2"
datain=""
s.wait(2)
pin2=datain[-6:-4]
print "Pin2",pin2
                     
                      
                
                      
                      

        

