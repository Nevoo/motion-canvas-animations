import { Layout, Node, Rect, makeScene2D } from "@motion-canvas/2d";
import {
    CodeBlock,
    edit,
    lines,
} from "@motion-canvas/2d/lib/components/CodeBlock";
import {
    Direction,
    Reference,
    Vector2,
    createRef,
    createSignal,
    slideTransition,
    waitFor,
    waitUntil,
} from "@motion-canvas/core";

export default makeScene2D(function* (view) {
    const previewSize = view.size().sub(160);
    const backgroundSize = createSignal(previewSize.add(160));

    const [codeRef, rectRef, rect] = codeRect(
        previewSize,
        1,
        `export const routes = {
    home: "/",
    about: "/about",
    contact: "/contact",
    gallery: "/gallery/:id",
};`
    );

    codeRef().opacity(1);

    view.add(<Layout>{rect}</Layout>);

    yield* slideTransition(Direction.Right);

    yield* waitUntil("url");

    yield* codeRef().selection(lines(4, 4), 1);

    yield* waitUntil("cut");

    yield* codeRef().edit(1)`
    ${edit(
        `export const routes = {
    home: "/",
    about: "/about",
    contact: "/contact",
    gallery: "/gallery/:id",
};`,
        `function Carousel({ radius = 2 }) {

    const navigate = useNavigate();
    const categories = useImageState((state) => state.categories);
    const [tappedImage, setTappedImage] = useState(null);

    // ...

    const trail = useTrail(categories.length, {
        
        // ...

        onRest: (value, _, __) => {
            if (value.finished && tappedImage !== null) {
                navigate(routes.gallery.replace(":id", tappedImage));
            }
        },
    });

    // ...
}`
    )}`;

    yield* waitFor(5);
    yield* codeRef().selection(lines(12, 16), 1);

    yield* waitFor(2);
    yield* codeRef().selection(lines(13, 15), 1);

    yield* waitFor(30);
});

function codeRect(
    previewSize: Vector2,
    grow?: number,
    code?: string
): [Reference<CodeBlock>, Reference<Rect>, Node] {
    const codeRef = createRef<CodeBlock>();
    const rectRef = createRef<Rect>();

    const rect = (
        <Rect
            grow={grow}
            ref={rectRef}
            padding={20}
            radius={15}
            fill={"#242424"}
            layout
        >
            <CodeBlock
                opacity={0}
                ref={codeRef}
                fontSize={26}
                language="tsx"
                code={code}
            />
        </Rect>
    );
    return [codeRef, rectRef, rect];
}
