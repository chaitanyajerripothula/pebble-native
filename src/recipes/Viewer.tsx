import { PureComponent, default as React } from "react";
import { StyleSheet, View } from "react-native";
import {
  CircularButton,
  ConfirmationPopUp,
  InfoCard,
  Text
} from "../components";
import { colors } from "../theme";
import Icon from "@anarock/pebble/native/Icon";
import Select from "../components/Select";
import Button from "../components/Button";
import nI from "name-initials";
import { ViewerProps, ViewerState } from "./typings/Viewer";

const styles = StyleSheet.create({
  circButton: {
    marginBottom: 0,
    marginRight: 15
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20
  },
  rowLeft: { flex: 1, flexDirection: "row", alignItems: "center" }
});

const viewerInfoCard = StyleSheet.create({
  container: {
    marginBottom: 0
  },
  topSection: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0
  },
  heading: {
    marginBottom: 5
  }
});

export default class extends PureComponent<ViewerProps, ViewerState> {
  selectRef: React.RefObject<Select> = React.createRef();

  state = {
    showUnfollowConfirmation: false,
    selectedAgentId: null,
    showTransferConfirmation: false,
    showTransferAndFollowConfiguration: false
  };

  private openTransferConfirmationModal = () =>
    this.setState({
      showTransferConfirmation: true
    });

  private closeTransferConfirmationModal = () =>
    this.setState({
      showTransferConfirmation: false
    });

  private openTransferAndFollowConfigurationModal = () =>
    this.setState({
      showTransferAndFollowConfiguration: true
    });

  private closeTransferAndFollowConfigurationModal = () =>
    this.setState({
      showTransferAndFollowConfiguration: false
    });

  private openUnfollowConfirmationModal = () =>
    this.setState({
      showUnfollowConfirmation: true
    });

  private closeUnfollowConfirmationModal = () =>
    this.setState({
      showUnfollowConfirmation: false
    });

  private isUser = (id: number) => id === this.props.userId;

  render() {
    const {
      onTranferRequest,
      onUnfollowRequest,
      agents,
      viewers,
      owner,
      onCall
    } = this.props;

    const {
      showUnfollowConfirmation,
      selectedAgentId,
      showTransferConfirmation,
      showTransferAndFollowConfiguration
    } = this.state;

    return (
      <View style={{ width: "100%" }}>
        <InfoCard title="Current Owner">
          <View style={styles.container}>
            <View style={styles.rowLeft}>
              <CircularButton
                style={styles.circButton}
                label={nI(owner.name)}
                color={colors.white.base}
                backgroundColor={colors.blue.base}
              />
              <View style={{ flex: 1 }}>
                <Text color={colors.gray.darker} size={15}>
                  {this.isUser(owner.id) ? "You" : owner.name}
                </Text>
                {owner.subText}
              </View>

              {this.isUser(owner.id) ? (
                <Select
                  options={agents}
                  ref={this.selectRef}
                  label={() => (
                    <Text color={colors.violet.base}>Transfer Ownership</Text>
                  )}
                  onSelect={({ id }) =>
                    this.setState({
                      selectedAgentId: id
                    })
                  }
                  placeholder="Choose whom to transfer"
                  selected={selectedAgentId}
                  showFooterButton
                  autoClose={false}
                  footer={
                    <View
                      style={{
                        paddingHorizontal: 25,
                        paddingBottom: 25
                      }}
                    >
                      <Button.DoubleFooterButton
                        leftButtonLabel={"Transfer & Follow"}
                        rightButtonLabel={"Transfer"}
                        onLeftButtonPress={() => {
                          this.selectRef.current.toggle();
                          this.openTransferAndFollowConfigurationModal();
                        }}
                        onRightButtonPress={() => {
                          this.selectRef.current.toggle();
                          this.openTransferConfirmationModal();
                        }}
                        leftDisabled={!selectedAgentId}
                        rightDisabled={!selectedAgentId}
                      />
                    </View>
                  }
                />
              ) : (
                <Icon
                  name="phone-filled"
                  color={colors.violet.base}
                  size={18}
                  onPress={() => onCall(owner.phone)}
                />
              )}
            </View>
          </View>

          <InfoCard style={viewerInfoCard} title="Viewers">
            {viewers.map(viewer => (
              <View
                key={viewer.id}
                style={[
                  styles.container,
                  {
                    paddingVertical: 15
                  }
                ]}
              >
                <View style={styles.rowLeft}>
                  <CircularButton
                    style={styles.circButton}
                    label={nI(viewer.name)}
                    color={colors.white.base}
                    backgroundColor={colors.blue.base}
                  />
                  <View style={{ flex: 1 }}>
                    <Text color={colors.gray.darker} size={15}>
                      {this.isUser(viewer.id) ? "You" : viewer.name}
                    </Text>
                    {viewer.subText}
                  </View>

                  {this.isUser(viewer.id) ? (
                    <Text
                      color={colors.violet.base}
                      onPress={this.openUnfollowConfirmationModal}
                    >
                      Unfollow
                    </Text>
                  ) : (
                    <Icon
                      name="phone-filled"
                      color={colors.violet.base}
                      size={18}
                      onPress={() => onCall(viewer.phone)}
                    />
                  )}
                </View>
              </View>
            ))}
          </InfoCard>
        </InfoCard>

        <ConfirmationPopUp
          onRejectPress={this.closeUnfollowConfirmationModal}
          onConfirmPress={onUnfollowRequest}
          confirmButtonText={"Confirm"}
          rejectButtonText={"Cancel"}
          title="Transfer & Unfollow lead"
          description="Now since you have saved the contact, proceed by clicking on already saved. If you were unable to save the contact."
          onClose={this.closeUnfollowConfirmationModal}
          visible={showUnfollowConfirmation}
        />

        <ConfirmationPopUp
          onRejectPress={this.closeTransferConfirmationModal}
          onConfirmPress={() => {
            this.closeTransferAndFollowConfigurationModal();
            return onTranferRequest({
              agentId: selectedAgentId,
              follow: false
            });
          }}
          confirmButtonText={"Confirm"}
          rejectButtonText={"Cancel"}
          title="Transfer"
          description="Now since you have saved the contact, proceed by clicking on already saved. If you were unable to save the contact."
          onClose={this.closeTransferConfirmationModal}
          visible={showTransferConfirmation}
        />

        <ConfirmationPopUp
          onRejectPress={this.closeTransferAndFollowConfigurationModal}
          onConfirmPress={() => {
            this.closeTransferAndFollowConfigurationModal();
            return onTranferRequest({
              agentId: selectedAgentId,
              follow: true
            });
          }}
          confirmButtonText={"Confirm"}
          rejectButtonText={"Cancel"}
          title="Transfer & follow lead"
          description="Now since you have saved the contact, proceed by clicking on already saved. If you were unable to save the contact."
          onClose={this.closeTransferAndFollowConfigurationModal}
          visible={showTransferAndFollowConfiguration}
        />
      </View>
    );
  }
}