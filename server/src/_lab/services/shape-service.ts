import { ShapeRepository } from "@/_lab/repositories/shape-repository";
import { CreateShapeDTO } from "@/_lab/dto";

export class ShapeService {
  private shapeRepository: ShapeRepository;

  constructor() {
    this.shapeRepository = new ShapeRepository();
  }

  async create(data: CreateShapeDTO, labId: string) {
    return await this.shapeRepository.save(data, labId);
  }

  async findAll(labId: string) {
    return await this.shapeRepository.findAll(labId);
  }
}
