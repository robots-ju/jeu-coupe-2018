import pygame
from pygame.locals import *
pygame.init()
import socket
import struct
def createMailboxBuffer(mailboxName,payload):
    if mailboxName[-1]!="\0":
        mailboxName+="\0"
    mailboxLength=len(mailboxName)
    if type(payload)==str:
        if payload[-1]!="\0":
            payload+="\0"
        payloadLength=len(payload)
    elif type(payload) in (int,float):
        payloadLength=4
    elif type(payload)==bool:
        payloadLenght=1
    else:
        raise TypeError
    bufferLength=9+payloadLenght+mailboxLenght
    buffer=bytes([(bufferLength-2)%256,(bufferLength-2)//256,1,0,0x81,0x9E,mailboxLength])
    buffer+=mailboxName.encode()
    buffer+=bytes([payloadLength%256,payloadLength//256])
    if type(payload)==str:
        buffer+=payload.encode()
    elif type(payload) in (int,float):
        buffer+=struct.pack(b"<f",float(payload))
    elif type(payload)==bool:
        buffer+=bytes([1 if payload else 0])
    return buffer
sock=socket.socket(socket.AF_INET,socket.SOCK_DGRAM)
sock.bind(("",3015))
data,addr=sock.recvfrom(1024)
no_serie=data.split(b"\r\n")[0].split(b" ")[1]
cnx=socket.socket()
cnx.connect((addr[0],5555))
cnx.send(b'GET /target?sn=' + no_serie + b' VMTP1.0\r\nProtocol: EV3')
fnt=pygame.display.set_mode((0,0),FULLSCREEN)
height=fnt.get_rect().bottom
width=fnt.get_rect().left
if width<1090:
    raise EnvironmentError("L'écran est trop petit")
if height<550:
    raise EnvironmentError("L'écran est trop petit")
bricks=[pygame.Surface((100,100)),pygame.image.load("avancer.png"), pygame.image.load("reculer.png"), pygame.image.load(""),pygame.image.load(""),pygame.image.load(""), pygame.image.load("")]
bricks[0].fill((255,247,239))
bas=pygame.Surface((width,150))
bas.fill((255,247,239))
i=1
while i<7:
    bas.blit(bricks[i],(width//2-575+150*i,25))
    i+=1
fond=pygame.Surface((width,height))
fond.fill((255,255,255))
continuer=1
while continuer:
    for event in pygame.event.get():
        if event.type==MOUSEBUTTONDOWN:
            if event.pos[1] in range(height-150,height-50):
                if event.pos[0] in range(width//2-425,width//2+425):
                    if (event.pos[0]-width//2+425)%150<=100:
                        block=(event.pos[0]-width//2+600)//150
                        x=(event.pos[0]-width//2+425)%150
                        y=event.pos[1]-height+125
        elif event.type==MOUSEMOTION:
            if event.buttons==(1,0,0):
                fnt.blit(blocks[block],(event.pos[0]-x,event.pos[1]-y))
    pygame.display.flip()
    fnt.blit(fond,(0,0))
    fnt.blit(bas,(0,height-150))