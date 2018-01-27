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
data,addr=sock.recv(1024)
