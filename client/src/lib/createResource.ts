export interface Resource<T> {
  read(): T;
  getStatus(): "pending" | "success" | "error";
  cancel(): void
}

/**
 * Creates a resource that triggers suspense by throwing a promise when read while fetch
 * is pending. React is weird. Relays `cancel` to the underlying fetch function.
 * @param fetchFn Fetch function, e.g created through `apiFactory`
 * @returns accessors for state of the passed async `fetchFn`.
 */
export function createResource<T>(fetchFn: () => Promise<T>) {
  let status: "pending" | "success" | "error" = "pending";
  let result: T | Error;
  let promise = fetchFn().then(
    (data) => {
      // console.log("Fetch resolved:", data);
      status = "success";
      result = data;
    },
    (error) => {
      // console.log("Fetch rejected:", error);
      status = "error";
      result = error;
    }
  );
  return {
    read() {
      // console.log("Reading, status:", status);
      if (status === "pending") throw promise;
      if (status === "error") throw result;
      return result as T;
    },
    getStatus() {
      return status;
    },
    cancel() {
      //@ts-expect-error
      fetchFn.cancel && fetchFn.cancel();
    },
  };
}
