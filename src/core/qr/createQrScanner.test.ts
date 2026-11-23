import { createQrScanner } from './createQrScanner';
import { createNativeScanner } from './nativeScanner';
import { createZxingScanner } from './zxingScanner';

vi.mock('./nativeScanner', () => ({ createNativeScanner: vi.fn(() => ({ kind: 'nativo' })) }));
vi.mock('./zxingScanner', () => ({ createZxingScanner: vi.fn(() => ({ kind: 'zxing' })) }));

describe('createQrScanner', () => {
  afterEach(() => {
    Reflect.deleteProperty(window, 'BarcodeDetector');
    vi.clearAllMocks();
  });

  it('usa o leitor nativo quando o BarcodeDetector existe', async () => {
    Object.defineProperty(window, 'BarcodeDetector', { value: vi.fn(), configurable: true });

    expect(await createQrScanner()).toEqual({ kind: 'nativo' });
    expect(createZxingScanner).not.toHaveBeenCalled();
  });

  it('usa o zxing quando o BarcodeDetector nao existe', async () => {
    expect(await createQrScanner()).toEqual({ kind: 'zxing' });
    expect(createNativeScanner).not.toHaveBeenCalled();
  });
});
