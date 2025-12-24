import { BaseController } from "@buildingai/base";
import { BuildFileUrl } from "@buildingai/decorators/file-url.decorator";
import { Public } from "@buildingai/decorators/public.decorator";
import { WebController } from "@common/decorators/controller.decorator";
import { Get } from "@nestjs/common";

import { AgentDecorateService } from "../../services/agent-decorate.service";

@WebController("agent-decorate")
export class AgentDecorateWebController extends BaseController {
    constructor(private readonly agentDecorateService: AgentDecorateService) {
        super();
    }

    @Get()
    @Public()
    @BuildFileUrl(["**.heroImageUrl", "**.overlayIconUrl"])
    async get() {
        return await this.agentDecorateService.getConfig();
    }
}
