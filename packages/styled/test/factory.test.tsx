// import { render, screen } from "@solidjs/testing-library";
// import user from "@testing-library/user-event";
// import { cva, styled } from "../src";
//
// const Component = styled.div(cva({}));
//
// const ComponentUnderTest = () => (
//   <styled.div
//     id="parent"
//     data-part="parent"
//     data-testid="parent"
//     class=""
//     style={{ background: "red" }}
//     asChild={(props) => (
//       <span
//         {...props({ id: "child", class: "child", style: { color: "blue" } })}
//         data-part="child"
//         data-testid="child"
//       >
//         Child
//       </span>
//     )}
//   >
//     Parent
//   </styled.div>
// );
//
// describe("Factory", () => {
//   it("should render only the child", () => {
//     render(() => <ComponentUnderTest />);
//     expect(screen.getByText("Child")).toBeVisible();
//   });
//
//   it("should merge styles", () => {
//     render(() => <ComponentUnderTest />);
//     expect(screen.getByText("Child")).toHaveStyle({
//       color: "rgb(0, 0, 255)",
//       background: "red",
//     });
//   });
//
//   it("should merge classes", () => {
//     render(() => <ComponentUnderTest />);
//     expect(screen.getByText("Child")).toHaveClass("child parent");
//   });
//
//   it("should merge events", async () => {
//     const onClickParent = vi.fn();
//     const onClickChild = vi.fn();
//     render(() => (
//       <styled.div
//         data-testid="parent"
//         onClick={onClickParent}
//         asChild={(props) => (
//           <styled.span
//             {...props({ onClick: onClickChild })}
//             data-testid="child"
//           />
//         )}
//       >
//         Parent
//       </styled.div>
//     ));
//     await user.click(screen.getByTestId("child"));
//     expect(onClickParent).toHaveBeenCalled();
//     expect(onClickChild).toHaveBeenCalled();
//   });
//
//   it("should stop propagate asChild", async () => {
//     render(() => (
//       <styled.div
//         data-testid="parent"
//         asChild={(props) => (
//           <styled.span {...props()}>
//             <styled.span>Child</styled.span>
//           </styled.span>
//         )}
//       >
//         Parent
//       </styled.div>
//     ));
//     expect(screen.getByText("Child")).not.toHaveAttribute(
//       "data-testid",
//       "parent",
//     );
//   });
// });
