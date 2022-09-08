import { useEffect, useRef, useState } from "react";
import {
  Card,
  Tabs,
  Tab,
  StakeInfo,
  StakeInfoItem,
  StakeInfoItemSmall,
  LightGrayItemText,
  MutliplierValue,
  StyledProgressBar,
  APYInfoItem,
  UsdcLogo,
  InfoIcon,
  Divider,
  InputBlockWrapper,
  StakeInfoRow,
  StakeAPYInfoRow,
  InnerPoolStakeInfo,
  ArrowIconUp,
  ArrowIconDown,
} from "./StakingForm.styles";

import { PopperTooltip } from "components/Tooltip";
import StakingInputBlock from "../StakingInputBlock";
import { StakingFormPropType } from "../../types";
import { repeatableTernaryBuilder } from "utils/ternary";
import {
  formatEther,
  formatNumberMaxFracDigits,
  isNumberEthersParseable,
} from "utils";

type StakeTab = "stake" | "unstake";

export const StakingForm = ({
  isConnected,
  walletConnectionHandler,
  userCumulativeStake,
  lpTokenName,
  currentMultiplier,
  usersMultiplierPercentage,
  usersTotalLPTokens,
  ageOfCapital,
  availableLPTokenBalance,
  globalCumulativeStake,
  shareOfPool,
  lpTokenFormatter: formatLPToken,
  lpTokenParser: parseLPToken,
  stakeActionFn,
  unstakeActionFn,
  isWrongNetwork,
  estimatedPoolApy,
}: StakingFormPropType) => {
  const [activeTab, setActiveTab] = useState<StakeTab>("stake");
  const [isPoolInfoVisible, setIsPoolInfoVisible] = useState(false);
  const [stakeAmount, setStakeAmount] = useState("");
  const [isTransitioning, setTransitioning] = useState(false);
  const isRendered = useRef(false);

  const buttonHandler = isWrongNetwork
    ? () => {}
    : isConnected
    ? () => {
        (activeTab === "stake" ? stakeActionFn : unstakeActionFn)(
          parseLPToken(stakeAmount),
          setTransitioning,
          isRendered
        );
      }
    : walletConnectionHandler;

  const buttonTextPrefix = isConnected ? "" : "Connect wallet to ";
  const buttonMaxValue = formatLPToken(
    activeTab === "stake" ? availableLPTokenBalance : userCumulativeStake
  ).replaceAll(",", "");
  const ArrowIcon = isPoolInfoVisible ? ArrowIconUp : ArrowIconDown;

  // Stub data for form
  function validateStakeAmount(amount: string) {
    if (!isNumberEthersParseable(amount)) {
      return false;
    }
    const requestedAmount = parseLPToken(amount);
    return (
      requestedAmount.gte("0") &&
      requestedAmount.lte(parseLPToken(buttonMaxValue))
    );
  }

  const valueOrEmpty = repeatableTernaryBuilder(
    isConnected && !isWrongNetwork,
    <>-</>
  );

  useEffect(() => {
    if (!isTransitioning) {
      setStakeAmount("");
    }
  }, [activeTab, isTransitioning]);

  useEffect(() => {
    setIsPoolInfoVisible(false);
  }, [isConnected]);

  useEffect(() => {
    isRendered.current = true;
    return () => {
      isRendered.current = false;
    };
  }, []);

  return (
    <Card>
      <Tabs>
        <Tab
          onClick={() => setActiveTab("stake")}
          active={activeTab === "stake"}
        >
          Stake
        </Tab>
        <Tab
          onClick={() => setActiveTab("unstake")}
          active={activeTab === "unstake"}
        >
          Unstake
        </Tab>
      </Tabs>
      <InputBlockWrapper>
        <StakingInputBlock
          value={stakeAmount}
          setValue={setStakeAmount}
          valid={!isConnected || validateStakeAmount(stakeAmount)}
          buttonText={`${buttonTextPrefix} ${activeTab}`}
          Logo={UsdcLogo}
          maxValue={buttonMaxValue === "0" ? "" : buttonMaxValue}
          omitInput={!isConnected}
          onClickHandler={buttonHandler}
          displayLoader={isTransitioning}
        />
      </InputBlockWrapper>
      <Divider />
      <StakeInfo>
        <StakeInfoRow>
          <StakeInfoItem>Staked LP Tokens</StakeInfoItem>
          <StakeInfoItem>
            {valueOrEmpty(
              <div>
                <LightGrayItemText margin={4}>
                  {formatLPToken(userCumulativeStake)} /
                </LightGrayItemText>
                {formatLPToken(usersTotalLPTokens)} {lpTokenName}
              </div>
            )}
          </StakeInfoItem>
        </StakeInfoRow>
        <StakeInfoRow>
          <StakeInfoItem>
            Age of capital
            <PopperTooltip
              title="Age of capital"
              body="The age of capital is the time since the last time you staked LP tokens."
              placement="bottom-start"
            >
              <InfoIcon />
            </PopperTooltip>
          </StakeInfoItem>
          <StakeInfoItem>
            {valueOrEmpty(
              <>
                {ageOfCapital <= 0
                  ? "-"
                  : `${formatNumberMaxFracDigits(ageOfCapital)} Days`}
              </>
            )}
          </StakeInfoItem>
        </StakeInfoRow>
        <StakeInfoRow>
          <StakeInfoItem>
            Multiplier
            <PopperTooltip
              title="Multiplier"
              body="The multiplier is the amount of LP tokens you get for staking."
              placement="bottom-start"
            >
              <InfoIcon />
            </PopperTooltip>
          </StakeInfoItem>
          <StakeInfoItem>
            {valueOrEmpty(
              <MutliplierValue>
                <StyledProgressBar percent={usersMultiplierPercentage} />
                {formatEther(currentMultiplier)} x
              </MutliplierValue>
            )}
          </StakeInfoItem>
        </StakeInfoRow>
        <StakeInfoRow>
          <StakeInfoItemSmall>
            Note: Multipliers of previously staked tokens are not impacted
          </StakeInfoItemSmall>
        </StakeInfoRow>
        <Divider />
        <StakeAPYInfoRow
          onClick={() => {
            setIsPoolInfoVisible((value) => !value);
          }}
        >
          <StakeInfoItem>
            <APYInfoItem>
              <ArrowIcon />
              Your total APY
            </APYInfoItem>
          </StakeInfoItem>
          <StakeInfoItem>
            {valueOrEmpty(<LightGrayItemText>2.81%</LightGrayItemText>)}
          </StakeInfoItem>
        </StakeAPYInfoRow>
        <InnerPoolStakeInfo visible={isPoolInfoVisible}>
          <Divider />
          <StakeInfoRow>
            <StakeInfoItem>Your Rewards APY</StakeInfoItem>
            <StakeInfoItem>
              {valueOrEmpty(
                <div>
                  <LightGrayItemText margin={4}>2.43%</LightGrayItemText>
                  Base 2.11%
                </div>
              )}
            </StakeInfoItem>
          </StakeInfoRow>
          <StakeInfoRow>
            <StakeInfoItem>Pool liquidity</StakeInfoItem>
            <StakeInfoItem>
              {valueOrEmpty(
                <div>
                  <LightGrayItemText margin={4}>
                    ${formatLPToken(globalCumulativeStake)}
                  </LightGrayItemText>
                </div>
              )}
            </StakeInfoItem>
          </StakeInfoRow>
          <StakeInfoRow>
            <StakeInfoItem>Pool APY</StakeInfoItem>
            <StakeInfoItem>
              {valueOrEmpty(
                <LightGrayItemText margin={4}>
                  {formatEther(estimatedPoolApy)}%
                </LightGrayItemText>
              )}
            </StakeInfoItem>
          </StakeInfoRow>
          <StakeInfoRow>
            <StakeInfoItem>Share of pool</StakeInfoItem>
            <StakeInfoItem>
              {valueOrEmpty(
                <LightGrayItemText margin={4}>
                  {formatEther(shareOfPool)}%
                </LightGrayItemText>
              )}
            </StakeInfoItem>
          </StakeInfoRow>
        </InnerPoolStakeInfo>
      </StakeInfo>
    </Card>
  );
};

export default StakingForm;