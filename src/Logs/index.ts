import bunyan from "bunyan";

class Log_Sergice {
  private static instance: Log_Sergice;

  private constructor() {
    if (Log_Sergice.instance) {
      throw new Error("Log_Sergice already exists");
    } else {
      Log_Sergice.instance = this;
    }
  }

  public static getInstance(): Log_Sergice {
    if (!Log_Sergice.instance) {
      Log_Sergice.instance = new Log_Sergice();
    }
    return Log_Sergice.instance;
  }

  public createLogger(name: string): bunyan {
    return bunyan.createLogger({ name, level: "debug" });
  }
}

export const LogSergice: Log_Sergice = Log_Sergice.getInstance();
