import { WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { AuthService } from "src/auth/auth.service";

@WebSocketGateway({
   cors: {
    orgin : '*',
   }, 
})

export class ProductsGateway {

    constructor (private readonly authService:AuthService){}

    @WebSocketServer()
    private readonly server: Server


    handleproductupdated(){
           this.server.emit('updated')
    }

    handleConnection(client: Socket) {
    try {
      this.authService.verifyToken(client.handshake.auth.Authentication.value);
    } catch (err) {
      throw new WsException('Unauthorized.');
    }
  }

}
