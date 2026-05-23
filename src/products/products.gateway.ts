import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { AuthService } from "src/auth/auth.service";

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  transports: ['polling'],
  path: '/socket.io/',
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
      const token = client.handshake.auth?.Authentication?.value ?? client.handshake.auth?.Authentication;
      if (!token) {
        client.disconnect();
        return;
      }
      this.authService.verifyToken(token);
    } catch (err) {
      client.disconnect();
    }
  }

}
