import { Circle, Txt, makeScene2D } from "@motion-canvas/2d";
import { Three } from "../components/Three";
import { Color, Group, MeshBasicMaterial, Quaternion, Vector3 } from "three";
import {
    Direction,
    Vector2,
    all,
    createComputed,
    createRef,
    createSignal,
    easeInOutCubic,
    easeOutExpo,
    sequence,
    slideTransition,
    tween,
    useScene,
    waitFor,
    waitUntil,
} from "@motion-canvas/core";
import * as normals from "../three/normals";
import { CodeBlock } from "@motion-canvas/2d/lib/components/CodeBlock";

export default makeScene2D(function* (view) {
    const three = createRef<Three>();
    const scenePosition = createSignal(new Vector2(100, 100));
    const codeRef = createRef<CodeBlock>();

    yield* slideTransition(Direction.Right);

    view.add(
        <Three
            ref={three}
            quality={2}
            width={1920}
            height={1080}
            zoom={100}
            position={scenePosition}
            background={"#0f0e17"}
            scene={normals.threeScene}
            camera={normals.camera}
        />
    );

    const orbitX = createSignal(0);
    const orbitY = createSignal(-(Math.PI / 4));

    const arrowADesRotY = createSignal(Math.PI / 2);
    const arrowBDesRotX = createSignal(Math.PI / 2);
    const arrowBDesRotY = createSignal(0);
    const arrowCDesRotX = createSignal(Math.PI / 2);
    const arrowCDesRotY = createSignal(0);

    useScene().lifecycleEvents.onBeginRender.subscribe(() => {
        normals.orbit.rotation.set(orbitX(), orbitY(), 0, "XYZ");
        normals.arrowMaterialA.color.setRGB(0.5, 0, 0);
        normals.arrowMaterialB.color.setRGB(0, 0.5, 0);
        normals.arrowMaterialC.color.setRGB(0, 0, 0.5);
        normals.arrowA.rotation.set(0, 0, 0);
        normals.arrowA.children[2].rotation.set(0, arrowADesRotY(), 0);
        normals.arrowB.rotation.set(Math.PI / 2, 0, Math.PI);
        normals.arrowB.children[2].rotation.set(
            arrowBDesRotX(),
            arrowBDesRotY(),
            0
        );
        normals.arrowC.rotation.set(Math.PI / 2, 0, Math.PI / 2);
        normals.arrowC.children[2].rotation.set(
            arrowCDesRotX(),
            arrowCDesRotY(),
            0
        );
    });

    normals.plane.scale.setScalar(0);

    for (const arrow of [normals.arrowA, normals.arrowB, normals.arrowC]) {
        arrow.scale.setScalar(0);
        arrow.rotation.set(Math.PI / 2, 0, 0);
    }

    yield* all(
        sequence(
            0.1,
            tween(0.3, (value) =>
                normals.arrowA.scale.setScalar(easeInOutCubic(value * 1.5))
            ),
            tween(0.3, (value) =>
                normals.arrowB.scale.setScalar(easeInOutCubic(value * 1.5))
            ),
            tween(0.3, (value) =>
                normals.arrowC.scale.setScalar(easeInOutCubic(value * 1.5))
            ),
            tween(0.3, (value) =>
                normals.plane.scale.setScalar(easeInOutCubic(value * 1.5))
            )
        ),
        orbitY(Math.PI * 2 - Math.PI / 4, 1)
    );

    yield* waitUntil("XandZ");

    yield* all(
        tween(0.3, (value) =>
            normals.arrowA.scale.setScalar(easeInOutCubic(value, 1, 0))
        ),
        arrowBDesRotY(-Math.PI, 1),
        arrowCDesRotY(Math.PI / 2, 1),
        orbitY(-Math.PI, 1),
        scenePosition(new Vector2(-100, 100), 1)
    );

    yield* waitUntil("upAndDown");

    yield* tween(0.3, (value) =>
        normals.plane.position.setY(easeInOutCubic(value, 1, 2))
    );
    yield* tween(0.3, (value) =>
        normals.plane.position.setY(easeInOutCubic(value, 2, 1))
    );

    yield* three().position([-2000, 0], 1);
    yield* waitUntil("ai");

    view.add(
        <CodeBlock
            opacity={0}
            ref={codeRef}
            width={1700}
            x={300}
            fontSize={26}
            language="tsx"
            code={`
let position = [
    radius * Math.sin((index * 2 * Math.PI) / images.length),
    0,
    radius * Math.cos((index * 2 * Math.PI) / images.length),
]
    `}
        />
    );

    yield* codeRef().opacity(1, 1);

    yield* waitFor(2.5);
});
