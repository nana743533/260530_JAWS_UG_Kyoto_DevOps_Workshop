import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../../src/context/CartContext';

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

const mockProduct = {
  id: 1,
  name: 'ノートパソコン',
  price: 89800,
  image: '💻',
  stock: 10,
  category: 'electronics',
};

const mockProduct2 = {
  id: 2,
  name: 'ワイヤレスマウス',
  price: 2980,
  image: '🖱️',
  stock: 25,
  category: 'accessories',
};

describe('CartContext - addToCart', () => {
  it('空のカートに商品を追加できる', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 1);
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0]).toMatchObject({
      id: 1,
      name: 'ノートパソコン',
      quantity: 1,
    });
  });

  it('同じ商品を追加すると数量が加算される', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 1);
    });
    act(() => {
      result.current.addToCart(mockProduct, 2);
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].quantity).toBe(3);
  });

  it('異なる商品を追加するとカートに別アイテムとして追加される', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 1);
    });
    act(() => {
      result.current.addToCart(mockProduct2, 2);
    });

    expect(result.current.cart).toHaveLength(2);
  });

  it('数量を省略するとデフォルト1で追加される', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct);
    });

    expect(result.current.cart[0].quantity).toBe(1);
  });
});

describe('CartContext - removeFromCart', () => {
  it('指定した商品がカートから削除される', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 1);
      result.current.addToCart(mockProduct2, 1);
    });
    act(() => {
      result.current.removeFromCart(1);
    });

    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].id).toBe(2);
  });

  it('存在しないIDを指定してもエラーにならない', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 1);
    });
    act(() => {
      result.current.removeFromCart(999);
    });

    expect(result.current.cart).toHaveLength(1);
  });
});

describe('CartContext - updateQuantity', () => {
  it('数量を更新できる', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 1);
    });
    act(() => {
      result.current.updateQuantity(1, 5);
    });

    expect(result.current.cart[0].quantity).toBe(5);
  });

  it('数量を0にするとカートから削除される', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 3);
    });
    act(() => {
      result.current.updateQuantity(1, 0);
    });

    expect(result.current.cart).toHaveLength(0);
  });

  it('数量を負の値にするとカートから削除される', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 3);
    });
    act(() => {
      result.current.updateQuantity(1, -1);
    });

    expect(result.current.cart).toHaveLength(0);
  });
});

describe('CartContext - clearCart', () => {
  it('カートが空になる', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 2);
      result.current.addToCart(mockProduct2, 3);
    });
    act(() => {
      result.current.clearCart();
    });

    expect(result.current.cart).toHaveLength(0);
  });
});

describe('CartContext - cartCount', () => {
  it('カート内の商品数量合計が正しい', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 2);
      result.current.addToCart(mockProduct2, 3);
    });

    expect(result.current.cartCount).toBe(5);
  });

  it('空のカートのcartCountは0', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.cartCount).toBe(0);
  });
});

describe('CartContext - cartTotal', () => {
  it('カート内の合計金額が正しい', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 2);  // 89800 * 2
      result.current.addToCart(mockProduct2, 3); // 2980 * 3
    });

    expect(result.current.cartTotal).toBe(89800 * 2 + 2980 * 3);
  });

  it('空のカートのcartTotalは0', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.cartTotal).toBe(0);
  });

  it('数量更新後に合計が再計算される', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 1);
    });
    act(() => {
      result.current.updateQuantity(1, 3);
    });

    expect(result.current.cartTotal).toBe(89800 * 3);
  });
});
