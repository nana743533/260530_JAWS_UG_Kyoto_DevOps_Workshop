import { describe, it, expect } from 'vitest';
import { calculateTax, calculateShipping, calculateTotal } from '../../src/utils/pricing';

describe('calculateTax', () => {
  it('1000円の消費税は100円（端数なし）', () => {
    expect(calculateTax(1000)).toBe(100);
  });

  it('0円の消費税は0円', () => {
    expect(calculateTax(0)).toBe(0);
  });

  it('端数が出る場合は切り捨てるべき（例: 999円 → 99円）', () => {
    // 999 * 0.1 = 99.9 → 切り捨てなら 99
    expect(calculateTax(999)).toBe(99);
  });

  it('端数が出る場合は切り捨てるべき（例: 101円 → 10円）', () => {
    // 101 * 0.1 = 10.1 → 切り捨てなら 10
    expect(calculateTax(101)).toBe(10);
  });

  it('端数が出る場合は切り捨てるべき（例: 1円 → 0円）', () => {
    // 1 * 0.1 = 0.1 → 切り捨てなら 0
    expect(calculateTax(1)).toBe(0);
  });

  it('大きい金額でも正しく計算される（89800円 → 8980円）', () => {
    expect(calculateTax(89800)).toBe(8980);
  });
});

describe('calculateShipping', () => {
  it('5000円以上は送料無料', () => {
    expect(calculateShipping(5000)).toBe(0);
  });

  it('5000円超も送料無料', () => {
    expect(calculateShipping(10000)).toBe(0);
  });

  it('4999円は送料500円', () => {
    expect(calculateShipping(4999)).toBe(500);
  });

  it('0円は送料500円', () => {
    expect(calculateShipping(0)).toBe(500);
  });

  it('境界値: 5001円は送料無料', () => {
    expect(calculateShipping(5001)).toBe(0);
  });
});

describe('calculateTotal', () => {
  it('5000円以上: 小計 + 税 + 送料0', () => {
    // 10000 + 1000(税) + 0(送料) = 11000
    expect(calculateTotal(10000)).toBe(11000);
  });

  it('5000円未満: 小計 + 税 + 送料500', () => {
    // 1000 + 100(税) + 500(送料) = 1600
    expect(calculateTotal(1000)).toBe(1600);
  });

  it('0円の場合: 0 + 0(税) + 500(送料) = 500', () => {
    expect(calculateTotal(0)).toBe(500);
  });

  it('境界値5000円: 5000 + 500(税) + 0(送料) = 5500', () => {
    expect(calculateTotal(5000)).toBe(5500);
  });
});
