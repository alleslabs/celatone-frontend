export const createQueryFnWithTimeout =
  <T>(queryFn: () => Promise<T>, ms: number = 6 * 60 * 1000) =>
  () =>
    Promise.race([
      queryFn(),
      new Promise<T>((_, reject) => {
        setTimeout(
          () =>
            reject(
              new Error(
                `Failed to receive query response in ${ms} milliseconds`
              )
            ),
          ms
        );
      }),
    ]);
