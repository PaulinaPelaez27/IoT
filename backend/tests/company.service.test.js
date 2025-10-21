const { CompanyService } = require('../src/services/company.service');
const { CompanyModel } = require('../src/models/company.model');

// Mocks
jest.mock('../src/models/company.model');

describe('CompanyService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCompany', () => {
    it('should create a new company if it does not exist', async () => {
      CompanyModel.getCompanyByName.mockResolvedValue(null);
      CompanyModel.createCompany.mockResolvedValue({ id: 1, name: 'Nodalis', address: 'Quito' });

      const result = await CompanyService.createCompany('Nodalis', 'Quito');

      expect(CompanyModel.getCompanyByName).toHaveBeenCalledWith('Nodalis');
      expect(CompanyModel.createCompany).toHaveBeenCalledWith('Nodalis', 'Quito');
      expect(result).toEqual({ id: 1, name: 'Nodalis', address: 'Quito' });
    });

    it('should throw if company already exists', async () => {
      CompanyModel.getCompanyByName.mockResolvedValue({ id: 2, name: 'Nodalis' });

      await expect(CompanyService.createCompany('Nodalis', 'Quito'))
        .rejects
        .toThrow('La empresa con el nombre Nodalis ya existe');
    });
  });

  describe('updateCompany', () => {
    it('should update a company by id', async () => {
      CompanyModel.updateCompany.mockResolvedValue({ id: 1, name: 'Kaeli Corp', address: 'Bruxelles' });

      const result = await CompanyService.updateCompany('1', 'Kaeli Corp', 'Bruxelles');

      expect(CompanyModel.updateCompany).toHaveBeenCalledWith(1, 'Kaeli Corp', 'Bruxelles');
      expect(result).toEqual({ id: 1, name: 'Kaeli Corp', address: 'Bruxelles' });
    });
  });

  describe('deleteCompany', () => {
    it('should delete company by id', async () => {
      CompanyModel.deleteCompany.mockResolvedValue({ message: 'Deleted' });

      const result = await CompanyService.deleteCompany('1');

      expect(CompanyModel.deleteCompany).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: 'Deleted' });
    });

    it('should throw custom error for foreign key constraint', async () => {
      const error = new Error('FK violation');
      error.code = 'P2003';
      CompanyModel.deleteCompany.mockRejectedValue(error);

      await expect(CompanyService.deleteCompany('1')).rejects.toThrow(
        'No se puede eliminar la empresa porque tiene usuarios o proyectos asociados.'
      );
    });

    it('should throw generic delete error otherwise', async () => {
      CompanyModel.deleteCompany.mockRejectedValue(new Error('Database is down'));

      await expect(CompanyService.deleteCompany('1')).rejects.toThrow(
        'Error al eliminar la empresa: Database is down'
      );
    });
  });

  describe('getAllCompanies', () => {
    it('should return all companies', async () => {
      const mockCompanies = [
        { id: 1, name: 'A', address: 'X' },
        { id: 2, name: 'B', address: 'Y' },
      ];
      CompanyModel.getAllCompanies.mockResolvedValue(mockCompanies);

      const result = await CompanyService.getAllCompanies();
      expect(result).toEqual(mockCompanies);
    });
  });

  describe('getCompanyById', () => {
    it('should return a company by id', async () => {
      const mockCompany = { id: 1, name: 'Z', address: 'W' };
      CompanyModel.getCompanyById.mockResolvedValue(mockCompany);

      const result = await CompanyService.getCompanyById(1);
      expect(result).toEqual(mockCompany);
    });
  });
});
