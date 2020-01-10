import { use, suffixPx } from '../utils';

export type IconProps = {
  tag: keyof HTMLElementTagNameMap | string;
  name: string;
  size?: string | number;
  color?: string;
  info?: string | number;
  classPrefix: string;
};

export type IconEvents = {
  onClick?(event: Event): void;
};

function isUrlIcon (name?: string): boolean {
  return name ? name.indexOf('/') !== -1 : false;
}

function Icon (h: CreateElement, props: IconProps, slots: DefaultSlots, ctx: RenderContext<IconProps>) {
  let urlIcon = isUrlIcon(props.name);

  return (<props.tag class={[
    props.classPrefix,
    urlIcon ? 'sky-icon--image' : `${props.classPrefix}-${props.name}`
  ]} style={{
    color: props.color,
    fontSize: suffixPx(props.size)
  }}>

  </props.tag>);
}

export default <IconProps, IconEvents>(Icon);