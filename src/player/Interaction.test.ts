import { describe, it, expect, vi } from 'vitest';
import { InteractionSystem, Interactable } from './Interaction';

const FORWARD = { x: 0, y: 0, z: -1 }; // looking down −Z

function makeItem(x: number, z: number, overrides: Partial<Interactable> = {}): Interactable {
  return {
    position: { x, y: 1, z },
    radius: 2.5,
    label: 'Test item',
    enabled: () => true,
    onInteract: () => {},
    ...overrides,
  };
}

describe('InteractionSystem targeting', () => {
  it('selects the nearest of two in-range items', () => {
    const sys = new InteractionSystem();
    const near = makeItem(0, -1, { label: 'near' });
    const far = makeItem(0, -2, { label: 'far' });
    sys.add(far);
    sys.add(near);
    sys.update({ x: 0, y: 0, z: 0 }, FORWARD);
    expect(sys.activeTarget).toBe(near);
  });

  it('excludes items beyond their radius', () => {
    const sys = new InteractionSystem();
    sys.add(makeItem(0, -10));
    sys.update({ x: 0, y: 0, z: 0 }, FORWARD);
    expect(sys.activeTarget).toBeNull();
  });

  it('excludes items behind the player (view-dot below threshold)', () => {
    const sys = new InteractionSystem();
    sys.add(makeItem(0, 1.5)); // behind when facing −Z
    sys.update({ x: 0, y: 0, z: 0 }, FORWARD);
    expect(sys.activeTarget).toBeNull();
  });

  it('excludes disabled items', () => {
    const sys = new InteractionSystem();
    sys.add(makeItem(0, -1, { enabled: () => false }));
    sys.update({ x: 0, y: 0, z: 0 }, FORWARD);
    expect(sys.activeTarget).toBeNull();
  });

  it('fires onPromptChange when the target changes, with the label', () => {
    const sys = new InteractionSystem();
    const prompts: (string | null)[] = [];
    sys.onPromptChange = (l) => prompts.push(l);
    const item = makeItem(0, -1, { label: 'Open door' });
    sys.add(item);
    sys.update({ x: 0, y: 0, z: 0 }, FORWARD);
    sys.update({ x: 0, y: 0, z: 0 }, FORWARD); // no change → no extra event
    sys.update({ x: 0, y: 0, z: 50 }, FORWARD); // walked away
    expect(prompts).toEqual(['Open door', null]);
  });
});

describe('InteractionSystem.interact', () => {
  it('activates the current target exactly once per call', () => {
    const sys = new InteractionSystem();
    const handler = vi.fn();
    sys.add(makeItem(0, -1, { onInteract: handler }));
    sys.update({ x: 0, y: 0, z: 0 }, FORWARD);
    expect(sys.interact()).toBe(true);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('returns false with no target and fires nothing', () => {
    const sys = new InteractionSystem();
    expect(sys.interact()).toBe(false);
  });

  it('re-checks enabled() at activation time', () => {
    const sys = new InteractionSystem();
    let on = true;
    const handler = vi.fn();
    sys.add(makeItem(0, -1, { enabled: () => on, onInteract: handler }));
    sys.update({ x: 0, y: 0, z: 0 }, FORWARD);
    on = false; // disabled between targeting and activation
    expect(sys.interact()).toBe(false);
    expect(handler).not.toHaveBeenCalled();
  });
});
