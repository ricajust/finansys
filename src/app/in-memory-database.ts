import { InMemoryDbService, RequestInfo } from "angular-in-memory-web-api";
import { Category } from "./pages/categories/shared/category.model";
import { Observable } from "rxjs";

export class InMemoryDataBase implements InMemoryDbService {
  createDb(reqInfo?: RequestInfo): {} | Observable<{}> | Promise<{}> {
      const categories:Category[] = [
        { id: 1, name: "Moradia", description: "Pagamentos de contas da casa" },
        { id: 2, name: "Saúde", description: "Plano de saúde e gastos médicos" },
        { id: 3, name: "Lazer", description: "Cinema, parques, viagens, etc" },
        { id: 4, name: "Salário", description: "A 'Paga' do mês :)" },
        { id: 5, name: "Freelas", description: "Trabalhos por fora" }
      ];

      return { categories };
  }
}
