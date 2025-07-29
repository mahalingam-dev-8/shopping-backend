import { createParamDecorator, ExecutionContext } from "@nestjs/common";


const getuserbycontext = (context:ExecutionContext) => {
    return context.switchToHttp().getRequest().user;
}


export const currentuser = createParamDecorator((_data:unknown,context:ExecutionContext) => 

    getuserbycontext(context)
    
);