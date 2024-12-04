import "@testing-library/jest-dom"; // jsdom matcher
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import {
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useLogin from "../hooks/useLogin";
import { PropsWithChildren } from "react";

const queryClient = new QueryClient({
  defaultOptions: {},
  logger: {
    log: console.log,
    warn: console.warn,
    error: process.env.NODE_ENV === "test" ? () => {} : console.error,
  },
});

describe("로그인 테스트", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const routes = [
      {
        path: "/login",
        element: <LoginPage />,
      },
    ];
    const router = createMemoryRouter(routes, {
      initialEntries: ["/login"],
      initialIndex: 0,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test("로그인에 실패하면 에러 메시지가 나타난다.", async () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const emailInput = screen.getByLabelText("이메일");
    const passwordInput = screen.getByLabelText("비밀번호");
    fireEvent.change(emailInput, {
      target: { value: "wrong-email@naver.com" },
    });
    fireEvent.change(passwordInput, { target: { value: "wrong-password" } });

    const loginButton = screen.getByRole("button", { name: /로그인/i });
    fireEvent.click(loginButton);

    const { result } = renderHook(() => useLogin(), { wrapper });

    // Then - 에러 메시지가 나타나야 한다.
    await waitFor(() => result.current.isError);
    const errorMessage = await screen.findByTestId("error-message");
    expect(errorMessage).toBeInTheDocument();
  });
});
