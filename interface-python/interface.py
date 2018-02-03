import pygame
from pygame.locals import *
pygame.init()
import socket
import struct
import sys
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
        payloadLength=1
    else:
        raise TypeError
    bufferLength=9+payloadLength+mailboxLength
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
addr=None
while addr==None:
    data,addr=sock.recvfrom(1024)
    if input("Se connecter à "+data.decode().split("\r\n")[2][6:]+" ? [O/n] ").upper()=="N":
        addr=None
no_serie=data.split(b"\r\n")[0].split(b" ")[1]
cnx=socket.socket()
cnx.connect((addr[0],5555))
cnx.send(b'GET /target?sn=' + no_serie + b' VMTP1.0\r\nProtocol: EV3')
fnt=pygame.display.set_mode((0,0),FULLSCREEN)
height=fnt.get_rect().bottom
width=fnt.get_rect().right
if width<1250:
    raise EnvironmentError("L'écran est trop petit")
if height<550:
    raise EnvironmentError("L'écran est trop petit")
blocks=[pygame.Surface((100,100)),pygame.image.load("avancer.png"), pygame.image.load("reculer.png"), pygame.image.load("gauche.png"),pygame.image.load("droite.png"),pygame.image.load("fermer.png"), pygame.image.load("ouvrir.png")]
blocks[0].fill((255,247,239))
bas=pygame.Surface((width,150))
bas.fill((255,247,239))
i=1
while i<7:
    bas.blit(blocks[i],(width//2-575+150*i,25))
    i+=1
bas.blit(pygame.image.load("start.png"),(width-150,25))
fond=pygame.Surface((width,height))
fond.fill((255,255,255))
touche=0
continuer=1
BLOCK=None
add_block=False
programm=[]
while continuer:
    for event in pygame.event.get():
        if event.type==MOUSEBUTTONDOWN:
            if event.pos[1] in range(height-150,height-50):
                if event.pos[0] in range(width//2-425,width//2+425):
                    if (event.pos[0]-width//2+425)%150<=100:
                        block=(event.pos[0]-width//2+600)//150
                        x=(event.pos[0]-width//2+425)%150
                        y=event.pos[1]-height+125
                        add_block=True
                if event.pos[0] in range(width-150,width-50):
                    _programm=0
                    for _block in programm:
                        _programm*=10
                        _programm+=_block
                    cnx.send(createMailboxBuffer("run",_programm))
                    programm=[]
            if event.pos[1] in range((height-250)//2,(height-50)//2):
                if (event.pos[0])//100<len(programm):
                    del programm[(event.pos[0])//100]
        elif event.type==MOUSEMOTION:
            if event.buttons==(1,0,0) and block!=None:
                BLOCK=(blocks[block],(event.pos[0]-x,event.pos[1]-y))
                if event.pos[1]-y in range((height-270)//2,(height-150)//2):
                    if (event.pos[0]-x+50)%100 < 60 and (event.pos[0]-x+50)//100<=len(programm):
                        programm.insert((event.pos[0]-x+50)//100,0)
        elif event.type==MOUSEBUTTONUP:
            if add_block:
                if event.pos[1]-y in range((height-270)//2,(height-150)//2):
                    if (event.pos[0]-x+50)%100 < 60 and (event.pos[0]-x+50)//100<=len(programm):
                        programm[(event.pos[0]-x+50)//100]=block
                        if len(programm)==11:
                            del programm[10]
                            print("\a",end="")
                            sys.stdout.flush()
            BLOCK=None
            block=None
            add_block=False
        elif event.type==KEYDOWN:
            if event.key==K_q:
                touche=1
            elif event.key==K_r and touche==1:
                touche=2
            elif event.key==K_c and touche==2:
                touche=3
            elif event.key==K_n and touche==3:
                touche=4
            elif event.key==K_u and touche==4:
                touche=5
            elif event.key==K_p and touche==5:
                touche=6
            else:
                touche=0
    i=0
    while i<len(programm):
        if programm[i] == 0:
            if BLOCK==None:
                del programm[i]
                continue
            if not BLOCK[1][1] in range((height-270)//2,(height-150)//2):
                del programm[i]
                continue
            if not ((BLOCK[1][0]+50)-100*i < 60 and (BLOCK[1][0]+50)-100*i > 0 ):
                del programm[i]
                continue
        fnt.blit(blocks[programm[i]],(100*i,(height-250)//2))
        i+=1
    if BLOCK!=None:
        fnt.blit(*BLOCK)
    pygame.display.flip()
    fnt.blit(fond,(0,0))
    fnt.blit(bas,(0,height-150))
    if touche==6:
        continuer=0
