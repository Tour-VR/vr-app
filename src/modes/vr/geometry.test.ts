import { facingCenterRotationY, yawToPosition } from './geometry';

function expectPosition(actual: [number, number, number], expected: [number, number, number]) {
  actual.forEach((value, index) => {
    expect(value).toBeCloseTo(expected[index]);
  });
}

describe('yawToPosition', () => {
  const r = 10;
  const h = -1;

  it('0 graus fica a frente (-Z)', () => {
    expectPosition(yawToPosition(0, r, h), [0, h, -r]);
  });

  it('90 graus fica a direita (+X)', () => {
    expectPosition(yawToPosition(90, r, h), [r, h, 0]);
  });

  it('-90 graus fica a esquerda (-X)', () => {
    expectPosition(yawToPosition(-90, r, h), [-r, h, 0]);
  });

  it('180 graus fica atras (+Z)', () => {
    expectPosition(yawToPosition(180, r, h), [0, h, r]);
  });
});

describe('facingCenterRotationY', () => {
  it('0 graus nao gira', () => {
    expect(facingCenterRotationY(0)).toBeCloseTo(0);
  });

  it('90 graus gira -pi/2', () => {
    expect(facingCenterRotationY(90)).toBeCloseTo(-Math.PI / 2);
  });
});
