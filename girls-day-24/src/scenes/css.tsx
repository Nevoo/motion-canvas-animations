import {
    Code,
    Layout,
    Rect,
    Txt,
    makeScene2D,
    LezerHighlighter,
    colorSignal,
} from "@motion-canvas/2d";
import {
    Color,
    Direction,
    Origin,
    PossibleColor,
    Vector2,
    all,
    beginSlide,
    createRef,
    createSignal,
    delay,
    easeInCubic,
    easeInOutCubic,
    makeRefs,
    slideTransition,
    waitUntil,
} from "@motion-canvas/core";
import { WhiteLabel } from "../styles";
import { IconTxt } from "../components/icon-text";
import html from "../images/icons/html.svg";
import js from "../images/icons/js.svg";
import css from "../images/icons/css.svg";
import { parser as cssParser } from "@lezer/css";
import { parser as htmlParser } from "@lezer/html";
import { parser as jsParser } from "@lezer/javascript";

const CssHighlighter = new LezerHighlighter(cssParser);
const HtmlHighlighter = new LezerHighlighter(htmlParser);
const JsHighlighter = new LezerHighlighter(jsParser);

export default makeScene2D(function* (view) {
    const renderer = createRef<Rect>();
    const passes = createRef<Layout>();
    const parallaxClone = createRef<Rect>();
    const background = createRef<Rect>();
    const parallax = makeRefs<typeof IconTxt>();
    const example = createRef<Layout>();

    const fontSize = createSignal(38);

    const backgroundColor = createSignal<PossibleColor>("white");
    const fontColor = createSignal<PossibleColor>("black");

    view.add(
        <>
            <Rect
                ref={background}
                width={1920}
                height={1080}
                fill={"#141414"}
                y={-1080}
            />
            <Rect
                ref={renderer}
                direction="column"
                layout
                fill="#242424"
                radius={8}
                height={0}
                clip
            >
                <Txt
                    cache
                    paddingLeft={40}
                    paddingRight={40}
                    paddingTop={20}
                    {...WhiteLabel}
                >
                    THE WEB BASICS
                </Txt>
                <Layout
                    ref={passes}
                    direction="row"
                    gap={20}
                    paddingLeft={40}
                    paddingRight={40}
                    marginBottom={40}
                    marginTop={20}
                    clip
                >
                    <IconTxt name="HTML" src={html} />
                    <IconTxt ref={parallaxClone} name="CSS" src={css} />
                    <IconTxt name="JS" src={js} />
                </Layout>
            </Rect>
            <IconTxt opacity={0} refs={parallax} name="CSS" src={css} />
            <Layout ref={example} layout opacity={0} gap={200}>
                <Code
                    fontSize={38}
                    highlighter={CssHighlighter}
                    code={() => `
h1 {
    background: ${backgroundColor()};
    color: ${fontColor()};
    font-size: ${fontSize().toFixed(1)}px;
}
`}
                />
                <Rect layout direction={"column"} justifyContent={"center"}>
                    <Rect
                        fill={() => backgroundColor()}
                        radius={10}
                        padding={50}
                    >
                        <Txt
                            fontSize={() => fontSize()}
                            fill={() => fontColor()}
                        >
                            Überschrift
                        </Txt>
                    </Rect>
                </Rect>
            </Layout>
        </>
    );

    yield* all(slideTransition(Direction.Right), renderer().size.y(null, 0.6));

    parallax.value.size(parallaxClone().size());
    parallax.value.absolutePosition(parallaxClone().absolutePosition());
    parallax.value.opacity(1);
    parallaxClone().opacity(0);

    yield* beginSlide("first slide");

    yield* waitUntil("parallax");

    yield* all(
        renderer().scale(Vector2.fromScalar(0.87), 0.6, easeInCubic),
        renderer().opacity(0, 0.6, easeInCubic),
        delay(0.2, parallax.value.ripple())
    );

    yield* waitUntil("move");
    yield* all(
        background().position.y(0, 0.4),
        parallax.value.position(
            view
                .getOriginDelta(Origin.TopRight)
                .sub(parallax.value.getOriginDelta(Origin.TopRight))
                .add(Vector2.fromScalar(-10)),
            1,
            easeInOutCubic,
            Vector2.arcLerp
        ),
        example().opacity(1, 0.8)
    );

    yield* beginSlide("second slide");

    yield* all(
        fontSize(48, 0.6),
        backgroundColor("#00F", 0.6),
        fontColor("#FFF", 0.6)
    );

    yield* waitUntil("next");

    yield* beginSlide("third slide");

    yield* all(
        fontSize(48, 0.6),
        backgroundColor("#7b03fc", 0.6)
        // fontColor("white", 0.6)
    );

    yield* beginSlide("fourth slide");
});
