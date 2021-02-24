import { initConnection } from "../src/Connection";
import { Service } from "../src/services/Service";
import { ServiceContext } from "../src/services/ServiceContext";

async function main() {
    const conn = await initConnection();
    const ctx = new ServiceContext(conn);
    const service = new Service(ctx);
    const userId = await service.userService.createUser("dragon77shopping@gmail.com", "Test Ryoi", "123456789");
    console.log(userId);
}

main();