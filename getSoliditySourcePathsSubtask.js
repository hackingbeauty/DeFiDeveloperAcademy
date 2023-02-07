subtask(
  TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS,
  async (_, { config }) => {
    const mainContracts = glob.sync(path.join(config.paths.root, "contracts/**/*.sol"));
    const testContracts = glob.sync(path.join(config.paths.root, "test/**/*.sol"));


    return [
      ...mainContracts,
      ...testContracts
    ]
  }
