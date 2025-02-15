import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { ProjectResultController } from '../project-results.controller';
import { ResultService } from '../results.server';
import { ProjectService } from '../../projects';

describe('ProjectResultController', () => {
  let projectResultController: ProjectResultController;

  let mockLogger: Logger;

  beforeEach(async () => {
    mockLogger = {
      warn: jest.fn(),
      log: jest.fn(),
      info: jest.fn(),
      error: jest.fn(),
    } as any as Logger;

    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProjectResultController],
      providers: [
        ResultService,
        ProjectService,
        {
          provide: Logger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    projectResultController = app.get<ProjectResultController>(
      ProjectResultController,
    );
  });

  describe('checkOnServer', () => {
    const mockProject = {
      get: (key: string) => {
        if (key === 'byteCodeHash')
          return '0x799813918fa0bdf07c97809b9d0d698d2c93356913a2c736747e65cb17f52045';
        if (key === 'factoryAddress')
          return '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9';
        return null;
      },
    };

    it('should pass when address matches computed address', () => {
      const salt =
        '0x000000000000000000000000000000000000000000000000000000000000000c';
      const address = '0x9B147D70D6bF720AC292E8ad862ad65E60769013';
      expect(() => {
        projectResultController.checkOnServer(
          mockProject as any,
          salt,
          address,
        );
      }).not.toThrow();
    });

    it('should throw error when address does not match', () => {
      const salt =
        '0x0000000000000000000000000000000000000000000000000000000000000001';
      const wrongAddress = '0x0000000000000000000000000000000000000000';

      (projectResultController as any).logger = mockLogger;
      expect(() => {
        projectResultController.checkOnServer(
          mockProject as any,
          salt,
          wrongAddress,
        );
      }).toThrow('address not match');
      expect(mockLogger.error).toHaveBeenCalledWith(
        `salt: ${salt}, address: ${wrongAddress}, serverComputedAddrress: 0x3984c61fCe2D300F174c2794c1581115ED9e0e20`,
      );
    });
  });
});
