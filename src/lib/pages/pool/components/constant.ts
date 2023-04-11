export const UndefinedTokenList = [
  "https://assets.alleslabs.dev/webapp-assets/asset/undefined-violet.svg",
  "https://assets.alleslabs.dev/webapp-assets/asset/undefined-white.svg",
  "https://assets.alleslabs.dev/webapp-assets/asset/undefined-violet-light.svg",
];
export const MockUpPoolList = [
  {
    pool_id: 31,
    create_tx_id: 1231354,
    account: {
      address: "osmo18z3mjlsy6vz0accnyu2c7lafzhe9l786q03ehx",
      id: 291362,
    },
    pool_liquidity: [
      {
        denom:
          "ibc/D38FD4C586C397DDAAB715C654DAEE3C3C40462CD410254AC7576208E947605B",
        amount: "3000000990",
      },
      {
        denom:
          "ibc/0BE7C3DAC50BB1C34565C76F01944DCC79B50CF359B63149B9E04E2A6736A6E6",
        amount: "1299997",
      },
      {
        denom: "uion",
        amount: "92330032",
      },
      {
        denom: "uosmo",
        amount: "2850",
      },
    ],
    pool_type: "Balancer",
    is_superfluid: false,
    is_supported: true,
    swap_fee: "0.03000000000000000",
    exit_fee: "0.0020000000000000",
    future_pool_governor: "24h",
    smooth_weight_change_params: {
      start_time: "2023-03-09T16:35:41Z",
      duration: "1209600s",
      initial_pool_weights: [
        {
          token: {
            denom:
              "factory/osmo15d4apf20449ajvwycq8ruaypt7v6d345z36n9l/factory",
            amount: "0",
          },
          weight: "2147483648",
        },
        {
          token: {
            denom: "stake",
            amount: "0",
          },
          weight: "1073741824",
        },
      ],
      target_pool_weights: [
        {
          token: {
            denom:
              "factory/osmo15d4apf20449ajvwycq8ruaypt7v6d345z36n9l/factory",
            amount: "20",
          },
          weight: "1073741824",
        },
        {
          token: {
            denom: "stake",
            amount: "10",
          },
          weight: "1073741824",
        },
      ],
    },
    scaling_factors: null,
    scaling_factor_controller: null,
    weight: [
      {
        denom:
          "ibc/D38FD4C586C397DDAAB715C654DAEE3C3C40462CD410254AC7576208E947605B",
        weight: "268435456000000",
      },
      {
        denom:
          "ibc/0BE7C3DAC50BB1C34565C76F01944DCC79B50CF359B63149B9E04E2A6736A6E6",
        weight: "268435456000000",
      },
      {
        denom: "uion",
        weight: "268435456000000",
      },
      {
        denom: "uosmo",
        weight: "268435456000000",
      },
    ],
    address: "osmo1jkxwvg4dua49hsfymvfl9s2wenmguqrq3dl0ttms047w6zv2n5sqh4svnn",
    total_shares: {
      denom: "gamm/pool/983",
      amount: "100000000000000000000",
    },
  },
  {
    pool_id: 231,
    create_tx_id: 1231354,
    account: {
      address: "osmo18z3mjlsy6vz0accnyu2c7lafzhe9l786q03ehx",
      id: 291362,
    },
    pool_liquidity: [
      {
        denom: "uion",
        amount: "268435456000000",
      },
      {
        denom:
          "ibc/ACA4C8A815A053CC027DB90D15915ADA31939FA331CE745862CDD00A2904FA17",
        amount: "268435456000000",
      },
      {
        denom: "uosmo",
        amount: "3053",
      },
      {
        denom:
          "ibc/7186C4B1A0596A1AB34C201E27D659B4A9837B46A328BCE5C0E452CD7146BC8F",
        amount: "1000",
      },
      {
        denom: "uion",
        amount: "1000",
      },
    ],
    pool_type: "Balancer",
    is_superfluid: true,
    is_supported: true,
    swap_fee: "0.0300000000000000",
    exit_fee: "0.000000000001",
    future_pool_governor: "24h",
    smooth_weight_change_params: null,
    scaling_factors: null,
    scaling_factor_controller: null,
    weight: [
      {
        denom:
          "ibc/ACA4C8A815A053CC027DB90D15915ADA31939FA331CE745862CDD00A2904FA17",
        weight: "268435456000000",
      },
      {
        denom:
          "ibc/FF3065989E34457F342D4EFB8692406D49D4E2B5C70F725F127862E22CE6BDCD",
        weight: "268435456000000",
      },
      {
        denom: "uosmo",
        weight: "268435456000000",
      },
      {
        denom:
          "ibc/7186C4B1A0596A1AB34C201E27D659B4A9837B46A328BCE5C0E452CD7146BC8F",
        weight: "268435456000000",
      },
      {
        denom: "uion",
        weight: "268435456000000",
      },
    ],
    address: "osmo1jkxwvg4dua49hsfymvfl9s2wenmguqrq3dl0ttms047w6zv2n5sqh4svnn",
    total_shares: {
      denom: "gamm/pool/343",
      amount: "100000000000000000000",
    },
  },
  {
    pool_id: 932,
    create_tx_id: 1231354,
    account: {
      address: "osmo18z3mjlsy6vz0accnyu2c7lafzhe9l786q03ehx",
      id: 291362,
    },
    pool_liquidity: [
      {
        denom: "uion",
        amount: "81386211729",
      },
      {
        denom: "uosmo",
        amount: "99224517983",
      },
    ],
    pool_type: "Stableswap",
    is_superfluid: true,
    is_supported: true,
    swap_fee: "0.00040000000000000",
    exit_fee: "0.00000000000000000",
    future_pool_governor: "24h",
    smooth_weight_change_params: null,
    scaling_factors: ["1", "1"],
    scaling_factor_controller: "",
    weight: null,
    address: "osmo1kxnekx4q8yem6wvp5t9ggqvhuxaqw7san00x5qdazp3fe597f8hsqft4nq",
    total_shares: {
      denom: "gamm/pool/383",
      amount: "100000000000000000000",
    },
  },
  {
    pool_id: 872,
    create_tx_id: 1231354,
    account: {
      address: "osmo18z3mjlsy6vz0accnyu2c7lafzhe9l786q03ehx",
      id: 291362,
    },
    pool_liquidity: [
      {
        denom:
          "ibc/FF3065989E34457F342D4EFB8692406D49D4E2B5C70F725F127862E22CE6BDCD",
        amount: "21181386729",
      },
      {
        denom:
          "ibc/F9E624EB89ABEE4CB1EC04D7941F613BD8383EE7DE323589A82066D0345EF6EB",
        amount: "17983992245",
      },
      {
        denom: "uosmo",
        amount: "17983992245",
      },
    ],
    pool_type: "Stableswap",
    is_superfluid: false,
    is_supported: true,
    swap_fee: "0.0004000000000000",
    exit_fee: "0.0000000000000000",
    future_pool_governor: "24h",
    smooth_weight_change_params: null,
    scaling_factors: ["1", "1", "1"],
    scaling_factor_controller: "",
    weight: null,
    address: "osmo1kxnekx4q8yem6wvp5t9ggqvhuxaqw7san00x5qdazp3fe597f8hsqft4nq",
    total_shares: {
      denom: "gamm/pool/483",
      amount: "100000000000000000000",
    },
  },
  {
    pool_id: 21,
    create_tx_id: 1231354,
    account: {
      address: "osmo18z3mjlsy6vz0accnyu2c7lafzhe9l786q03ehx",
      id: 291362,
    },
    pool_liquidity: [
      {
        denom:
          "ibc/62CD410254AC7576208E947605BD38FD4C586C397DDAAB715C654DAEE3C3C404",
        amount: "3053",
      },
      {
        denom:
          "ibc/CC79B50CF359B63149B9E04E2A6736A6E60BE7C3DAC50BB1C34565C76F01944D",
        amount: "127",
      },
      {
        denom:
          "ibc/CF359B63149B9E04E2A67CC79B5036A6E60BE7C3DAC50BB1C34565C76F01944D",
        amount: "9226",
      },
      {
        denom:
          "ibc/CFC3DAC50BB1C3456359B63149B9E04E2A67CC79B5036A6E60BE75C76F01944D",
        amount: "2825",
      },
    ],
    pool_type: "Balancer",
    is_superfluid: false,
    is_supported: false,
    swap_fee: "0.030000000000000000",
    exit_fee: "0.0000000000000000",
    future_pool_governor: "24h",
    smooth_weight_change_params: null,
    scaling_factors: null,
    scaling_factor_controller: null,
    weight: [
      {
        denom:
          "ibc/62CD410254AC7576208E947605BD38FD4C586C397DDAAB715C654DAEE3C3C404",
        weight: "268435456000000",
      },
      {
        denom:
          "ibc/CC79B50CF359B63149B9E04E2A6736A6E60BE7C3DAC50BB1C34565C76F01944D",
        weight: "268435456000000",
      },
      {
        denom:
          "ibc/CF359B63149B9E04E2A67CC79B5036A6E60BE7C3DAC50BB1C34565C76F01944D",
        weight: "268435456000000",
      },
      {
        denom:
          "ibc/CFC3DAC50BB1C3456359B63149B9E04E2A67CC79B5036A6E60BE75C76F01944D",
        weight: "268435456000000",
      },
    ],
    address: "osmo1jkxwvg4dua49hsfymvfl9s2wenmguqrq3dl0ttms047w6zv2n5sqh4svnn",
    total_shares: {
      denom: "gamm/pool/983",
      amount: "100000000000000000000",
    },
  },
  {
    pool_id: 221,
    create_tx_id: 1231354,
    account: {
      address: "osmo18z3mjlsy6vz0accnyu2c7lafzhe9l786q03ehx",
      id: 291362,
    },
    pool_liquidity: [
      {
        denom:
          "ibc/ACA4C90D15915ADA31939FA331CE745862CDD00A2904FA178A815A053CC027DB",
        amount: "3053",
      },
      {
        denom: "uosmo",
        amount: "127",
      },
      {
        denom:
          "ibc/725F127862E22CE6BDCDF70FF3065989E34457F342D4EFB8692406D49D4E2B5C",
        amount: "3053",
      },
      {
        denom:
          "ibc/6C4B1A0596A1AB34C201E27D659B4A9837B46A328BCE5C0E452CD7146BC7188F",
        amount: "1000",
      },
      {
        denom: "uion",
        amount: "1000",
      },
    ],
    pool_type: "Balancer",
    is_superfluid: true,
    is_supported: false,
    swap_fee: "0.030000000000000000",
    exit_fee: "0.000000000001",
    future_pool_governor: "24h",
    smooth_weight_change_params: null,
    scaling_factors: null,
    scaling_factor_controller: null,
    weight: [
      {
        denom:
          "ibc/ACA4C90D15915ADA31939FA331CE745862CDD00A2904FA178A815A053CC027DB",
        weight: "268435456000000",
      },
      {
        denom: "uosmo",
        weight: "268435456000000",
      },
      {
        denom:
          "ibc/725F127862E22CE6BDCDF70FF3065989E34457F342D4EFB8692406D49D4E2B5C",
        weight: "268435456000000",
      },
      {
        denom:
          "ibc/6C4B1A0596A1AB34C201E27D659B4A9837B46A328BCE5C0E452CD7146BC7188F",
        weight: "268435456000000",
      },
      {
        denom: "uion",
        weight: "268435456000000",
      },
    ],
    address: "osmo1jkxwvg4dua49hsfymvfl9s2wenmguqrq3dl0ttms047w6zv2n5sqh4svnn",
    total_shares: {
      denom: "gamm/pool/383",
      amount: "100000000000000000000",
    },
  },
  {
    pool_id: 941,
    create_tx_id: 1231354,
    account: {
      address: "osmo18z3mjlsy6vz0accnyu2c7lafzhe9l786q03ehx",
      id: 291362,
    },
    pool_liquidity: [
      {
        denom:
          "ibc/6CC201E27D659B4A9837B46A328BC4B1A0596A1AB34E5C0E452CD7146BC7188F",
        amount: "81386211729",
      },
      {
        denom:
          "ibc/9837B46A328BC4B6CC201E27D659B4A1A0596A1AB34E5C0E452CD7146BC7188F",
        amount: "99224517983",
      },
    ],
    pool_type: "Stableswap",
    is_superfluid: true,
    is_supported: false,
    swap_fee: "0.000400000000000000",
    exit_fee: "0.000000000000000000",
    future_pool_governor: "24h",
    smooth_weight_change_params: null,
    scaling_factors: ["1", "1"],
    scaling_factor_controller: "",
    weight: null,
    address: "osmo1kxnekx4q8yem6wvp5t9ggqvhuxaqw7san00x5qdazp3fe597f8hsqft4nq",
    total_shares: {
      denom: "gamm/pool/783",
      amount: "100000000000000000000",
    },
  },
  {
    pool_id: 372,
    create_tx_id: 1231354,
    account: {
      address: "osmo18z3mjlsy6vz0accnyu2c7lafzhe9l786q03ehx",
      id: 291362,
    },
    pool_liquidity: [
      {
        denom:
          "ibc/42D4EFB8692406FF3065989E34457F3D49D4E2B5C70F725F127862E22CE6BDCD",
        amount: "21181386729",
      },
      {
        denom:
          "ibc/ABEE4CB1EC04D7941F9E624EB89F613BD8383EE7DE323589A82066D0345EF6EB",
        amount: "17983992245",
      },
      {
        denom: "uion",
        amount: "17983992245",
      },
    ],
    pool_type: "Stableswap",
    is_superfluid: false,
    is_supported: false,
    swap_fee: "0.000400000000000000",
    exit_fee: "0.000000000000000000",
    future_pool_governor: "24h",
    smooth_weight_change_params: null,
    scaling_factors: ["1", "1", "1"],
    scaling_factor_controller: "",
    weight: null,
    address: "osmo1kxnekx4q8yem6wvp5t9ggqvhuxaqw7san00x5qdazp3fe597f8hsqft4nq",
    total_shares: {
      denom: "gamm/pool/783",
      amount: "100000000000000000000",
    },
  },
];
