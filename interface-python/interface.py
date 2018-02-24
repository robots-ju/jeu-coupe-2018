import pygame
from pygame.locals import *
pygame.init()
import socket
import struct
import sys
blockwidth=120
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
    entre=input("Se connecter à "+data.decode().split("\r\n")[2][6:]+" ? [O/n] ").upper()
    if entre=="":
        break
    if entre[0]=="N":
        addr=None
socket.socket(socket.AF_INET,socket.SOCK_DGRAM).sendto(b"a",addr)
no_serie=data.split(b"\r\n")[0].split(b" ")[1]
cnx=socket.socket()
cnx.connect((addr[0],5555))
cnx.send(b'GET /target?sn=' + no_serie + b' VMTP1.0\r\nProtocol: EV3')
if not cnx.recv(1024)==b"Accept:EV340\r\n\r\n":
    exit(1)
fnt=pygame.display.set_mode((0,0),FULLSCREEN)
height=fnt.get_rect().bottom
width=fnt.get_rect().right
programmosfet=width//2-410
if width<1250:
    raise EnvironmentError("L'écran est trop petit")
if height<650:
    raise EnvironmentError("L'écran est trop petit")
blocks=[pygame.Surface((100,100)),pygame.transform.scale(pygame.image.load("avancer.png"),(100,100)),pygame.transform.scale(pygame.image.load("reculer.png"),(100,100)),pygame.transform.scale(pygame.image.load("gauche.png"),(100,100)),pygame.transform.scale(pygame.image.load("droite.png"),(100,100)),pygame.transform.scale(pygame.image.load("fermer.png"),(100,100)),pygame.transform.scale(pygame.image.load("ouvrir.png"),(100,100))]
blocks[0].fill((255,96,0))
bas=pygame.Surface((width,150))
bas.fill((255,96,0))
i=1
while i<7:
    bas.blit(blocks[i],(width//2-575+150*i,25))
    i+=1
img_start=pygame.transform.scale(pygame.image.load("start.png"),(100,100))
bas.blit(img_start,(width-150,25))
fond=pygame.Surface((width,height))
fond.fill((0xff,0xaf,0x22))
logo=pygame.image.load("Logo Coupe Robots-JU.png")
fond.blit(logo,(width//2-(logo.get_rect().right)//2,(height-250)//4-(logo.get_rect().bottom)//2))
fond.blit(img_start,(programmosfet-120,(height-250)//2))
touche=0
continuer=1
BLOCK=None
add_block=False
programm=[]
cmpt=0
score=0
font=pygame.font.Font(None,300)
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
                if (event.pos[0]-programmosfet)//blockwidth<len(programm) and (event.pos[0]-programmosfet)//blockwidth>=0:
                    del programm[(event.pos[0]-programmosfet)//blockwidth]
                elif (event.pos[0]-programmosfet)//blockwidth==-1:
                    _programm=0
                    for _block in programm:
                        _programm*=10
                        _programm+=_block
                    cnx.send(createMailboxBuffer("run",_programm))
                    programm=[]
        elif event.type==MOUSEMOTION:
            if event.buttons==(1,0,0) and block!=None:
                BLOCK=(blocks[block],(event.pos[0]-x,event.pos[1]-y))
                if event.pos[1]-y in range((height-270)//2,(height-150)//2):
                    if (event.pos[0]-x+50-programmosfet)%blockwidth < 60 and (event.pos[0]-x+50-programmosfet)//blockwidth<=len(programm):
                        programm.insert((event.pos[0]-x+50-programmosfet)//blockwidth,0)
        elif event.type==MOUSEBUTTONUP:
            if add_block:
                if event.pos[1]-y in range((height-270)//2,(height-150)//2):
                    if (event.pos[0]-x+50-programmosfet)%blockwidth < 60 and (event.pos[0]-x+50-programmosfet)//blockwidth<=len(programm):
                        programm[(event.pos[0]-x+50-programmosfet)//blockwidth]=block
                        if len(programm)==8:
                            del programm[7]
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
                continuer=0
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
            if not ((BLOCK[1][0]+50-programmosfet)-blockwidth*i < 60 and (BLOCK[1][0]+50-programmosfet)-blockwidth*i > 0 ):
                del programm[i]
                continue
        fnt.blit(blocks[programm[i]],(blockwidth*i+programmosfet,(height-250)//2))
        i+=1
    if BLOCK!=None:
        fnt.blit(*BLOCK)
    SCORE=font.render(str(score),1,(0,0,255))
    fnt.blit(SCORE,(width//2-SCORE.get_rect().right//2,3*height//4-150))
    pygame.display.flip()
    fnt.blit(fond,(0,0))
    fnt.blit(bas,(0,height-150))
    cmpt+=1
    if cmpt%500==0:
        path=b"../prjs/coupe2018/score.rtf\0"
        msg=bytes([6+len(path),0,1,0,1,150,0,4])+path
        cnx.send(msg)
        file=cnx.recv(1024)
        if file[4]==3 and file[5]==150:
            score=int(file[12:].decode().split("\r")[0])
