import { Img, Rect, RectProps, Txt, invert } from "@motion-canvas/2d";
import {
    Color,
    SimpleSignal,
    createSignal,
    linear,
    makeRef,
} from "@motion-canvas/core";
import { BlackLabel, Colors, WhiteLabel } from "../styles";

export function IconTxt({
    name,
    src,
    refs,
    ref,
    ...props
}: {
    name: string;
    src: string;
    refs?: {
        value: Rect;
        theme: SimpleSignal<number>;
    };
} & RectProps) {
    const theme = createSignal(0);
    if (refs) {
        refs.theme = theme;
    }

    return (
        <Rect
            layout
            direction="column"
            fill={() =>
                Color.lerp(Colors.background, "rgba(0, 0, 0, 0)", theme())
            }
            radius={8}
            ref={refs ? makeRef(refs, "value") : ref}
            {...props}
        >
            <Txt
                textAlign={"center"}
                paddingRight={40}
                paddingLeft={40}
                {...BlackLabel}
                fill={() =>
                    Color.lerp(WhiteLabel.fill, BlackLabel.fill, theme())
                }
                lineHeight={80}
                cache
            >
                {name}
            </Txt>
            <Img
                filters={[invert(theme)]}
                opacity={() => linear(theme(), 0.87, 0.54)}
                width={100}
                height={100}
                margin={20}
                marginTop={0}
                src={src}
            />
        </Rect>
    );
}
